import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import LectureList from "./LectureList/LectureList";
import LectureScreen from "./LectureScreen/LectureScreen";
import LearnScreen from "./LearnScreen/LearnScreen";
import TestScreen from "./TestScreen/TestScreen";
import LoginForm from "./Forms/LoginForm";
import RegisterForm from "./Forms/RegisterForm";
import UserPanelScreen from "./UserPanel/UserPanelScreen";

import ConfirmationCodeSpecial from "./AccountCreation/ConfirmationCodeSpecial";

const Main = () => {
    const [ context, _ ] = useContext(AppContext);

    const appState = context.appState;

    return (
        <main className="main">
            {appState.currentScreen === "main" && <LectureList />}
            {appState.currentScreen === "lecture" && (
                <LectureScreen></LectureScreen>
            )}
            {appState.currentScreen === "learn" && <LearnScreen></LearnScreen>}
            {appState.currentScreen === "review" && (
                <LearnScreen isReview={true}></LearnScreen>
            )}
            {appState.currentScreen === "test" && <TestScreen />}
            {appState.currentScreen === "userPanel" && (
                <UserPanelScreen></UserPanelScreen>
            )}
            {appState.currentScreen === "login" && <LoginForm></LoginForm>}
            {appState.currentScreen === "register" && (
                <RegisterForm></RegisterForm>
            )}
            {appState.currentScreen === "confirmation" && (
                <ConfirmationCodeSpecial
                    title={"Check your email for a confirmation code."}
                    blocked={true}
                />
            )}
            {appState.currentScreen === "codeHelp" && (
                <ConfirmationCodeSpecial
                    title={
                        " Enter your email and confirmation code to complete registration."
                    }
                />
            )}
        </main>
    );
};

export default Main;