import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const BackButton = (props: { options: { currentScreen: string, currentLecture: null } }) => {
    const [ _, dispatch ] = useContext(AppContext);

    return (
        <button
            className="backButton"
            onClick={() =>
                dispatch({
                    type: "CHANGE_SCREEN",
                    payload: {
                        ...props.options,
                    },
                })
            }
        >
            Volver
        </button>
    );
};

export default BackButton;
