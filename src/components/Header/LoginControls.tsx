import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { logoutUser } from "../../aws/aws";
import { lectures } from "../../data/lectures";
import Spinner from "react-bootstrap/Spinner";
import LogoutModal from "./LogoutModal";

const LoginControls = (props: { userName: string, errorMsg: string}) => {
    const [ context, dispatch ] = useContext(AppContext);
    
    const isTakingTest = context.isTakingTest;
    const dbError = context.dbError;
    const init = context.init;
    const loggedIn = context.loggedIn;
    const loginControlErrorMessage = context.loginControlErrorMessage;
    const serverError = context.serverError;

    const [showModal, setShowModal] = useState(false);
    const [button, setButton] = useState<string | null>(null);

    const handleUserPanelClick = () => {
        if (isTakingTest) {
            setButton("userPanel");
            setShowModal(true);
        } else {
            changeToUserPanel();
        }
    };

    const changeToUserPanel = () => {
        dispatch({
            type: "CHANGE_SCREEN",
            payload: { currentScreen: "userPanel" },
        });
        dispatch({ type: "SET_IS_TAKING_TEST", payload: false });
    };

    const handleLogoutClick = (state: boolean) => {
        if (state) {
            setButton("logout");
        }

        setShowModal(state);
    };

    const logout = async () => {
        console.log("log out");
        try {
            await logoutUser();
            dispatch({
                type: "CHANGE_SCREEN",
                payload: { currentScreen: "main" },
            });
            dispatch({ type: "SET_LOG_STATUS", payload: false });
            dispatch({ type: "SET_USER", payload: { currentProgress: null } });
            dispatch({ type: "SET_IS_TAKING_TEST", payload: false });
            dispatch({ type: "SET_LECTURES", payload: lectures });
            dispatch({ type: "SET_LECTURES_FLAG", payload: false });
        } catch (error) {
            console.log(
                "🚀 ~ file: LoginControls.js:23 ~ logout ~ error:",
                error
            );
            alert("Logout failed, server is probably down, try again later.");
        }
    };

    const loggedInControls = (
        <div className="accountButtons">
            <button
                className="logoutButton"
                onClick={() => handleLogoutClick(true)}
            >
                logout
            </button>
            <div className="username" onClick={handleUserPanelClick}>
                {props.userName}
            </div>
            <LogoutModal
                visible={showModal}
                hideFunc={() => handleLogoutClick(false)}
                logoutFunc={logout}
                userPanelFunc={changeToUserPanel}
                buttonClicked={button}
            />
        </div>
    );

    const loggedOutControls = (
        <>
            <button
                className="registerButton"
                onClick={() =>
                    dispatch({
                        type: "CHANGE_SCREEN",
                        payload: {
                            currentScreen: "register",
                        },
                    })
                }
            >
                Register
            </button>
            <button
                className="loginButton"
                onClick={() =>
                    dispatch({
                        type: "CHANGE_SCREEN",
                        payload: {
                            currentScreen: "login",
                        },
                    })
                }
            >
                Login
            </button>
        </>
    );

    const setupControls = () => {
        if (!init) {
            return (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            );
        }

        if (serverError || dbError) {
            return <p>{loginControlErrorMessage}</p>;
        }

        if (loggedIn) {
            return loggedInControls;
        } else {
            return loggedOutControls;
        }
    };

    const controls = setupControls();
    return <>{controls}</>;
};

export default LoginControls;
