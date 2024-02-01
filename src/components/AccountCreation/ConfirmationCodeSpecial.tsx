import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { confirmUser } from "../../aws/aws";
import Spinner from "react-bootstrap/Spinner";
import { AxiosError } from "axios";

const ConfirmationCodeSpecial = (props: { blocked?: Boolean, title: String }) => {
    const [ context, dispatch ] = useContext(AppContext);
    const [formData, setFormData] = useState({
        email: context.user.userName,
        code: "",
    });
    const [message, setMessage] = useState("");
    const [thinking, setThinking] = useState(false);
    const [confirmed, setConfirmed] = useState(false);

    useEffect(() => {
        if (confirmed) {
            const delay = setTimeout(() => {
                dispatch({
                    type: "CHANGE_SCREEN",
                    payload: { currentScreen: "main" },
                });
            }, 2000);

            return () => clearTimeout(delay);
        }
    }, [confirmed]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                [event.target.name]: event.target.value,
            };
        });
    };

    const handleConfirmation = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessage("");
        setThinking(true);
        console.log("confirming");

        const email = formData.email;
        const code = formData.code;

        if (!email || !code) {
            setThinking(false);
            return setMessage("Email and code required.");
        }

        try {
            const response = await confirmUser(email, code);

            setMessage(response.data + ". You can now log in.");
            setConfirmed(true);
        } catch (error) {

            const Aerror = error as AxiosError;
            if (Aerror.code === "ERR_NETWORK") {
                setThinking(false);
                dispatch({ type: "SET_SERVER_ERROR", payload: true });
                dispatch({
                    type: "SET_LOGIN_CONTROL_MSG",
                    payload: "Server error, try refreshing the page.",
                });
                return setMessage("Network error. Please try again.");
            }

            //reset server error state just in case
            dispatch({ type: "SET_SERVER_ERROR", payload: false });

            //cualquier otro error que retorne cognito
            if (Aerror.code === "ERR_BAD_RESPONSE") {
                setThinking(false);
                return setMessage(Aerror.response?.data as string);
            }

            //dejo esto aqui por si hay otro errores raros que no encontre
            setThinking(false);
            alert("Hubo error con la peticion");
        }
    };

    const spinner = (
        <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    );

    return (
        <div className="confirmation">
            <h2>{props.title}</h2>
            <form onSubmit={handleConfirmation}>
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    required
                    value={formData.email as string}
                    onChange={handleChange}
                    disabled={props.blocked ? true : thinking}
                ></input>
                <label>Confirmation Code</label>
                <input
                    type="text"
                    name="code"
                    required
                    value={formData.code}
                    onChange={handleChange}
                    disabled={thinking}
                ></input>
                <button className="submitButton" disabled={thinking}>
                    Confirm
                </button>
            </form>
            {message && <p>{message}</p>}
            {thinking && spinner}
        </div>
    );
};

export default ConfirmationCodeSpecial;
