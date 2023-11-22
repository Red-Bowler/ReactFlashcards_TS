import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
    useLayoutEffect,
} from "react";
import _, { forEach } from "lodash";
import { createPortal } from "react-dom";
import {
    closestCenter,
    closestCorners,
    pointerWithin,
    rectIntersection,
    CollisionDetection,
    DndContext,
    DragOverlay,
    DropAnimation,
    getFirstCollision,
    MouseSensor,
    TouchSensor,
    Modifiers,
    useDroppable,
    useSensors,
    useSensor,
    MeasuringStrategy,
    defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
    AnimateLayoutChanges,
    SortableContext,
    useSortable,
    arrayMove,
    defaultAnimateLayoutChanges,
    verticalListSortingStrategy,
    rectSortingStrategy,
    rectSwappingStrategy,
    SortingStrategy,
    horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Container } from "./Container";
import { Item } from "./Item";

const animateLayoutChanges = (args) =>
    defaultAnimateLayoutChanges({ ...args, wasDragging: true });

function DroppableContainer({
    children,
    columns = 1,
    disabled,
    id,
    items,
    style,
    ...props
}) {
    const {
        active,
        attributes,
        isDragging,
        listeners,
        over,
        setNodeRef,
        transition,
        transform,
    } = useSortable({
        id,
        data: {
            type: "container",
            children: items,
        },
        animateLayoutChanges,
    });

    const isOverContainer = over
        ? (id === over.id && active?.data.current?.type !== "container") ||
          items.includes(over.id)
        : false;

    return (
        <Container
            ref={disabled ? undefined : setNodeRef}
            // style={{
            //     ...style,
            //     transition,
            //     transform: CSS.Translate.toString(transform),
            //     opacity: isDragging ? 0.5 : undefined,
            // }}
            hover={isOverContainer}
            handleProps={{
                ...attributes,
                ...listeners,
            }}
            columns={columns}
            {...props}
        >
            {children}
        </Container>
    );
}

const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: "0.5",
            },
        },
    }),
};

export const TRASH_ID = "void";
const PLACEHOLDER_ID = "placeholder";

export function MultipleContainers({
    adjustScale = true,
    itemCount = 3,
    cancelDrop,
    columns,
    handle = false,
    items: initialItems,
    containerStyle,
    getItemStyles = () => ({}),
    wrapperStyle = () => ({}),
    minimal = false,
    modifiers,
    renderItem,
    strategy = () => ({}),
    trashable = false,
    vertical = false,
    scrollable,
}) {
    const [items, setItems] = useState({
        FirstRowAnswer: [],
        SecondRowAnswer: [],
        Options: [`うち`, `は`, `にほん`, `じん`, `じゃありません`],
    });

    const [containers, setContainers] = useState(Object.keys(items));
    const [activeId, setActiveId] = useState(null);
    const lastOverId = useRef(null);
    const recentlyMovedToNewContainer = useRef(false);
    const containerWidth = useRef(null);
    const [width, setWidth] = useState(0);
    const isSortingContainer = activeId ? containers.includes(activeId) : false;

    const paddingSize = 20;
    const letterSize = 15;

    /**
     * Custom collision detection strategy optimized for multiple containers
     *
     * - First, find any droppable containers intersecting with the pointer.
     * - If there are none, find intersecting containers with the active draggable.
     * - If there are no intersecting containers, return the last matched intersection
     *
     */
    const collisionDetectionStrategy = useCallback(
        (args) => {
            // console.log("using collision detection strategy");
            // console.log("🚀 ~ file: DndTest.js:163 ~ activeId:", activeId);

            // return [{ id: "じゃありませんじん" }];

            // Start by finding any intersecting droppable
            const pointerIntersections = pointerWithin(args);
            const intersections =
                pointerIntersections.length > 0
                    ? // If there are droppables intersecting with the pointer, return those
                      pointerIntersections
                    : rectIntersection(args);
            let overId = getFirstCollision(intersections, "id");
            console.log("🚀 ~ file: DndTest.js:176 ~ overId:", overId);

            if (overId != null) {
                if (overId in items) {
                    const containerItems = items[overId];

                    // If a container is matched and it contains items (columns 'A', 'B', 'C')
                    if (containerItems.length > 0) {
                        // Return the closest droppable within that container
                        console.log("estoy ocupando el closescenter");
                        overId = closestCenter({
                            ...args,
                            droppableContainers:
                                args.droppableContainers.filter(
                                    (container) =>
                                        container.id !== overId &&
                                        containerItems.includes(container.id)
                                ),
                        })[0]?.id;

                        // overId = closestCorners({
                        //     ...args,
                        //     droppableContainers:
                        //         args.droppableContainers.filter(
                        //             (container) =>
                        //                 container.id !== overId &&
                        //                 containerItems.includes(container.id)
                        //         ),
                        // })[0]?.id;
                    }
                }
                console.log(
                    "🚀 ~ file: DndTest.js:176 ~ overId after closest to center:",
                    overId
                );
                lastOverId.current = overId;
                return [{ id: overId }];
            }

            // When a draggable item moves to a new container, the layout may shift
            // and the `overId` may become `null`. We manually set the cached `lastOverId`
            // to the id of the draggable item that was moved to the new container, otherwise
            // the previous `overId` will be returned which can cause items to incorrectly shift positions
            // if (recentlyMovedToNewContainer.current) {
            //     lastOverId.current = activeId;
            // }

            // If no droppable is matched, return the last match
            return lastOverId.current ? [{ id: lastOverId.current }] : [];
        },
        [activeId, items]
    );
    const [clonedItems, setClonedItems] = useState(null);
    const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
    const findContainer = (id) => {
        if (id in items) {
            return id;
        }

        return Object.keys(items).find((key) => items[key].includes(id));
    };

    const getIndex = (id) => {
        const container = findContainer(id);

        if (!container) {
            return -1;
        }

        const index = items[container].indexOf(id);

        return index;
    };

    const onDragCancel = () => {
        if (clonedItems) {
            // Reset items to their original state in case items have been
            // Dragged across containers
            setItems(clonedItems);
        }

        setActiveId(null);
        setClonedItems(null);
    };

    useEffect(() => {
        function handleWindowResize() {
            setWidth(containerWidth.current.clientWidth);
        }

        setWidth(containerWidth.current.offsetWidth);

        window.addEventListener("resize", handleWindowResize);

        return () => {
            window.removeEventListener("resize", handleWindowResize);
        };
    }, []);

    useEffect(() => {
        requestAnimationFrame(() => {
            recentlyMovedToNewContainer.current = false;
        });
    }, [items]);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={collisionDetectionStrategy}
            // collisionDetection={closestCorners}
            measuring={{
                droppable: {
                    strategy: MeasuringStrategy.Always,
                },
            }}
            onDragStart={({ active }) => {
                setActiveId(active.id);
                setClonedItems(items);
            }}
            onDragOver={({ active, over }) => {
                console.log("on drag over");
                const overId = over?.id;
                console.log("🚀 ~ file: DndTest.js:283 ~ overId:", overId);

                const overContainer = findContainer(overId);
                const activeContainer = findContainer(active.id);

                if (activeContainer !== overContainer) {
                    console.log("on drag over coming from different container");
                    let copy = _.cloneDeep(items[overContainer]);
                    copy.push(active.id);

                    let pixelLenght = 0;

                    copy.forEach((element) => {
                        pixelLenght +=
                            paddingSize + letterSize * element.length;
                    });

                    if (pixelLenght > width - 20) {
                        console.log("too long");
                        return;
                    }

                    setItems((items) => {
                        console.log(
                            "🚀 ~ file: DndTest.js:306 ~ previous items inside setItems:",
                            items
                        );
                        //items del container de donde vengo
                        const activeItems = items[activeContainer];
                        //items del container al que me estoy moviendo
                        const overItems = items[overContainer];

                        const overIndex = overItems.indexOf(overId);
                        console.log(
                            "🚀 ~ file: DndTest.js:316 ~ setItems ~ overIndex:",
                            overIndex
                        );
                        const activeIndex = activeItems.indexOf(active.id);

                        //
                        let newIndex;

                        if (overId in items) {
                            newIndex = overItems.length + 1;
                        } else {
                            const activeHalf =
                                active.rect.current.translated.width / 2;
                            const overHalf = over.rect.width / 2;

                            const isAfterOverItem =
                                over &&
                                active.rect.current.translated &&
                                active.rect.current.translated.left +
                                    activeHalf >
                                    over.rect.left + overHalf;

                            const modifier = isAfterOverItem ? 1 : 0;

                            newIndex =
                                overIndex >= 0
                                    ? overIndex + modifier
                                    : overItems.length;
                        }

                        recentlyMovedToNewContainer.current = true;

                        return {
                            ...items,
                            [activeContainer]: items[activeContainer].filter(
                                (item) => item !== active.id
                            ),
                            [overContainer]: [
                                ...items[overContainer].slice(0, newIndex),
                                items[activeContainer][activeIndex],
                                ...items[overContainer].slice(
                                    newIndex,
                                    items[overContainer].length
                                ),
                            ],
                        };
                    });
                } else {
                    console.log("on drag over within same container");
                    const activeId = active?.id;
                    console.log(
                        "🚀 ~ file: DndTest.js:367 ~ activeId:",
                        activeId
                    );
                    const overId = over?.id;
                    console.log("🚀 ~ file: DndTest.js:369 ~ overId:", overId);

                    // if (activeId === overId) {
                    //     console.log("did nothing");
                    // }

                    const overContainer = findContainer(overId);
                    console.log(
                        "🚀 ~ file: DndTest.js:378 ~ overContainer:",
                        overContainer
                    );

                    if (overContainer) {
                        const activeIndex = items[activeContainer].indexOf(
                            active.id
                        );
                        console.log(
                            "🚀 ~ file: DndTest.js:379 ~ activeIndex:",
                            activeIndex
                        );
                        const overIndex = items[overContainer].indexOf(overId);
                        console.log(
                            "🚀 ~ file: DndTest.js:381 ~ overIndex:",
                            overIndex
                        );

                        if (activeIndex !== overIndex) {
                            console.warn("reordering within same container");

                            setItems((items) => ({
                                ...items,
                                [overContainer]: arrayMove(
                                    items[overContainer],
                                    activeIndex,
                                    overIndex
                                ),
                            }));
                            // setItems((items) => ({
                            //     ...items,
                            //     [overContainer]: [
                            //         ...items[overContainer].slice(0, overIndex),
                            //         items[activeContainer][activeIndex],
                            //         ...items[overContainer].slice(
                            //             overIndex,
                            //             items[overContainer].length
                            //         ),
                            //     ],
                            // }));
                        }
                    }

                    // setActiveId(null);
                }
            }}
            onDragEnd={({ active, over }) => {
                // const activeContainer = findContainer(active.id);

                // const overId = over?.id;

                // const overContainer = findContainer(overId);

                // if (overContainer) {
                //     const activeIndex = items[activeContainer].indexOf(
                //         active.id
                //     );
                //     const overIndex = items[overContainer].indexOf(overId);

                //     if (activeIndex !== overIndex) {
                //         setItems((items) => ({
                //             ...items,
                //             [overContainer]: arrayMove(
                //                 items[overContainer],
                //                 activeIndex,
                //                 overIndex
                //             ),
                //         }));
                //     }
                // }

                setActiveId(null);
            }}
            cancelDrop={cancelDrop}
            onDragCancel={onDragCancel}
            modifiers={modifiers}
        >
            <div ref={containerWidth} className="dragAndDrop">
                <h2>Width: {width}</h2>
                <p>{items["FirstRowAnswer"]}</p>
                {/* <SortableContext
                    items={[...containers, PLACEHOLDER_ID]}
                    strategy={strategy}
                > */}
                {containers.map((containerId) => (
                    <DroppableContainer
                        key={containerId}
                        id={containerId}
                        label={`Column ${containerId}`}
                        columns={columns}
                        items={items[containerId]}
                        scrollable={scrollable}
                        style={containerStyle}
                        unstyled={minimal}
                        onRemove={() => handleRemove(containerId)}
                    >
                        <SortableContext
                            items={items[containerId]}
                            strategy={strategy}
                        >
                            {items[containerId].map((value, index) => {
                                return (
                                    <SortableItem
                                        disabled={isSortingContainer}
                                        key={value}
                                        id={value}
                                        index={index}
                                        handle={handle}
                                        style={getItemStyles}
                                        wrapperStyle={wrapperStyle}
                                        renderItem={renderItem}
                                        containerId={containerId}
                                        getIndex={getIndex}
                                    />
                                );
                            })}
                        </SortableContext>
                    </DroppableContainer>
                ))}
                {/* </SortableContext> */}
            </div>
            {createPortal(
                <DragOverlay
                    className="optionsParent"
                    //adjustScale={adjustScale}
                    dropAnimation={dropAnimation}
                >
                    {activeId
                        ? containers.includes(activeId)
                            ? renderContainerDragOverlay(activeId)
                            : renderSortableItemDragOverlay(activeId)
                        : null}
                </DragOverlay>,
                document.body
            )}
        </DndContext>
    );

    function renderSortableItemDragOverlay(id) {
        return (
            <Item
                value={id}
                handle={handle}
                style={getItemStyles({
                    containerId: findContainer(id),
                    overIndex: -1,
                    index: getIndex(id),
                    value: id,
                    isSorting: true,
                    isDragging: true,
                    isDragOverlay: true,
                })}
                wrapperStyle={wrapperStyle({ index: 0 })}
                renderItem={renderItem}
                dragOverlay
            />
        );
    }

    function renderContainerDragOverlay(containerId) {
        return (
            <Container
                label={`Column ${containerId}`}
                columns={columns}
                style={{
                    height: "100%",
                }}
                shadow
                unstyled={false}
            >
                {items[containerId].map((item, index) => (
                    <Item
                        key={item}
                        value={item}
                        handle={handle}
                        style={getItemStyles({
                            containerId,
                            overIndex: -1,
                            index: getIndex(item),
                            value: item,
                            isDragging: false,
                            isSorting: false,
                            isDragOverlay: false,
                        })}
                        wrapperStyle={wrapperStyle({ index })}
                        renderItem={renderItem}
                    />
                ))}
            </Container>
        );
    }

    function handleRemove(containerID) {
        setContainers((containers) =>
            containers.filter((id) => id !== containerID)
        );
    }

    function getNextContainerId() {
        const containerIds = Object.keys(items);
        const lastContainerId = containerIds[containerIds.length - 1];

        return String.fromCharCode(lastContainerId.charCodeAt(0) + 1);
    }
}

function SortableItem({
    disabled,
    id,
    index,
    handle,
    renderItem,
    style,
    containerId,
    getIndex,
    wrapperStyle,
}) {
    const {
        setNodeRef,
        setActivatorNodeRef,
        listeners,
        isDragging,
        isSorting,
        over,
        overIndex,
        transform,
        transition,
    } = useSortable({
        id,
    });
    const mounted = useMountStatus();
    const mountedWhileDragging = isDragging && !mounted;

    return (
        <Item
            ref={disabled ? undefined : setNodeRef}
            value={id}
            dragging={isDragging}
            sorting={isSorting}
            handle={handle}
            handleProps={handle ? { ref: setActivatorNodeRef } : undefined}
            index={index}
            wrapperStyle={wrapperStyle({ index })}
            style={style({
                index,
                value: id,
                isDragging,
                isSorting,
                overIndex: over ? getIndex(over.id) : overIndex,
                containerId,
            })}
            transition={transition}
            transform={transform}
            fadeIn={mountedWhileDragging}
            listeners={listeners}
            renderItem={renderItem}
        />
    );
}

function useMountStatus() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setIsMounted(true), 500);

        return () => clearTimeout(timeout);
    }, []);

    return isMounted;
}

////////////////////////////////////////////////////////////////

function Trash({ id }) {
    const { setNodeRef, isOver } = useDroppable({
        id,
    });

    return (
        <div
            ref={setNodeRef}
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "fixed",
                left: "50%",
                marginLeft: -150,
                bottom: 20,
                width: 300,
                height: 60,
                borderRadius: 5,
                border: "1px solid",
                borderColor: isOver ? "red" : "#DDD",
            }}
        >
            Drop here to delete
        </div>
    );
}

function getLength(array) {
    let count = 0;
    array.forEach((element) => {
        count += element.length;
    });
    return count;
}
