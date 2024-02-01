import TermList from "./TermList";
import { tests } from "../../data/tests";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import LectureScreenButtons from "./LectureScreenButtons";
import BackToTopButton from "../Buttons/BackToTopButton";
// import { lectures } from "../../data/lectures";
import svg from "../../svg/cherry-blossom-petal.svg";
import DismissableBanner from "../Misc/DismissableBanner";
import { LectureType } from "../../data/lectures";

const LectureScreen = () => {
    const [ context, _ ] = useContext(AppContext);

    const appState = context.appState;
    const loggedIn = context.loggedIn;
    const lectures = context.lectures;
    
    const lectureId = appState.currentLecture;
    const lecture = lectures.find((lecture) => {
        console.log("lectscreen tsx lecture.lectureId", typeof lecture.lectureId);
        console.log("lectscreen tsx lectureId", typeof lectureId);
        console.log("lectscreen tsx lecture.lectureId === lectureId", lecture.lectureId === lectureId);
        return lecture.lectureId === lectureId;
    }) as LectureType;

    console.log("lectscreen tsx lectureId", lectureId);
    console.log("lectscreen tsx ", lectures);

    const hasTest = (Number(lecture?.lectureId) in tests)? true : false;
    const showTestButton = hasTest ? true : false;

    return (
        <div className="lectureScreen">
            {!loggedIn && (
                <DismissableBanner
                    text={"Accede al modo Memorizar o Prueba con tu cuenta."}
                    bgColor={"#ab071d"}
                    color={"white"}
                    transition={1}
                ></DismissableBanner>
            )}

            <h2 id="title" className="lectureTitle" >
                {lecture?.name}
            </h2>
            <LectureScreenButtons test={showTestButton} />

            <div
                className="upperDivider"
                style={{
                    marginBottom: "9px",
                }}
            >
                <img
                    className="upperLogo"
                    src={svg}
                    style={{
                        width: "68px",
                        top: "-26px",
                        marginLeft: "calc(50% - 34px)",
                    }}
                ></img>
            </div>
            <div className="termListDiv">
                <h2>Lista Palabras</h2>
                <TermList lecture={lecture}></TermList>
                <BackToTopButton />
            </div>
        </div>
    );
};

export default LectureScreen;
