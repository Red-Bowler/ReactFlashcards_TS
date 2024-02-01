import LectureButton from "../LectureButton";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

const LectureButtons = () => {
    const [ context, _ ] = useContext(AppContext);

    const lectures = context.lectures;

    const lectureButtons = lectures.map((lecture) => {
        return (
            <LectureButton
                lecture={lecture}
                key={lecture.lectureId}
                id={Number(lecture.lectureId)}
                amount={lecture.termList.length}
                title={lecture.name}
            />
        );
    });
    return (
        <>
            {lectureButtons}
        </>
    );
};

export default LectureButtons;
