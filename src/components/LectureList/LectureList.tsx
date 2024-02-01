import LectureButtons from "./LectureButtons";
import BackToTopButton from "../Buttons/BackToTopButton";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import Spinner from "react-bootstrap/Spinner";
import { getExtraLessons, getExtraPerms } from "../../aws/aws";
import DismissableBanner from "../Misc/DismissableBanner";
import SearchBar from "../SearchBar/SearchBar";
import { AxiosResponse } from "axios";
import { LectureType } from "../../data/lectures";

const LectureList = () => {
    const [context, dispatch] = useContext(AppContext);

    const loggedIn = context.loggedIn;
    const lectures = context.lectures;
    const gotLectures = context.gotLectures;
    const user = context.user;

    const [extraLessonMessage, setExtraLessonMessage] = useState("");

    useEffect(() => {
        const getLectures = async () => {
            try {
                //consulta a los permisos
                const userEmail = user.userName;

                const perms = await getExtraPerms(userEmail) as AxiosResponse;

                const result = perms.data.Item ? perms.data.Item.access : [];

                if (result.length === 0) {
                    setExtraLessonMessage("No tienes acceso a mas lecciones.");
                    return dispatch({
                        type: "SET_LECTURES_FLAG",
                        payload: true,
                    });
                }

                const response = await getExtraLessons(result) as AxiosResponse;

                type DBLectureItem = { orderNumber: number, lecture: string};

                const more_lectures: DBLectureItem[] = response.data.Responses.lectures;

                if (more_lectures.length > 0) {
                    const orderedResults =
                    more_lectures.sort(
                            (a, b) => a.orderNumber - b.orderNumber
                        );

                    const extraLectures = orderedResults.map((item) => {
                        return JSON.parse(item.lecture) as LectureType;
                    });

                    const newLectures = [...lectures, ...extraLectures];

                    dispatch({
                        type: "SET_LECTURES",
                        payload: newLectures,
                    });
                    dispatch({ type: "SET_LECTURES_FLAG", payload: true });
                }
            } catch (error) {
                console.log(
                    "🚀 ~ file: LectureList.js:25 ~ getLectures ~ error:",
                    error
                );
            }
        };

        if (loggedIn && !gotLectures) {
            getLectures();
        }
    }, [loggedIn]);

    return (
        <div className="lectureList">
            {!loggedIn && (
                <DismissableBanner
                    text={
                        "Inicia sesion o crea una cuenta para guardar tu progreso."
                    }
                    bgColor={"#ab071d"}
                    color={"white"}
                    transition={1}
                ></DismissableBanner>
            )}
            <SearchBar />
            <h2 className="lectureListTitle">Lecciones</h2>
            <div className="lectureButtons">
                <LectureButtons />
                {loggedIn && !gotLectures ? (
                    <Spinner
                        className="spinner"
                        animation="border"
                        role="status"
                    >
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                ) : (
                    ""
                )}
                <p>{extraLessonMessage}</p>
            </div>
            <BackToTopButton />
        </div>
    );
};

export default LectureList;
