import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const LectureButton = (props) => {
    const { dispatch, loaded, loggedIn, currentProgress } =
        useContext(AppContext);
    return (
        <div
            className="lectureButton"
            onClick={() =>
                dispatch({
                    type: "CHANGE_SCREEN",
                    payload: {
                        newScreen: "lecture",
                        newLecture: props.id,
                    },
                })
            }
        >
            <span>{props.amount} terms</span>

            {loggedIn ? (
                currentProgress ? (
                    <span>{props.percentage} learned</span>
                ) : (
                    <span>loading</span>
                )
            ) : (
                ""
            )}

            {/* {loggedIn ? (
                <span>{props.percentage} learned</span>
            ) : (
                <span>loading</span>
            )} */}

            <span>{props.title}</span>
        </div>
    );
};

export default LectureButton;
