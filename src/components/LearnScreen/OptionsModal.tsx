import Modal from "react-bootstrap/Modal";

const OptionsModal = (props: { flip: boolean, visible: boolean, hideFunc: () => void, handleFlip: () => void, random: boolean, handleRandom: () => void }) => {
    const languageText = (
        <p>
            {"(Respondiendo con: "}
            <span className="languageText">
                {props.flip ? "Japones" : "Español"}
            </span>{" "}
            {")"}
        </p>
    );
    return (
        <Modal show={props.visible} onHide={props.hideFunc}>
            <Modal.Header closeButton>
                <Modal.Title>Opciones</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="form-check form-switch">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="flipTermsSwitch"
                        checked={props.flip}
                        onChange={props.handleFlip}
                    />
                    <label
                        className="form-check-label"
                        htmlFor="flipTermsSwitch"
                    >
                        Intercambia entre Español y Japones
                    </label>
                    <p className="form-check-p">
                        Ocupa esta opcion para intercambiar la pregunta con la
                        respuesta. El avanze de Español y Japones es guardado
                        por separado.
                        {languageText}
                    </p>
                </div>
                <div className="form-check form-switch">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="randomSwitch"
                        checked={props.random}
                        onChange={props.handleRandom}
                    />
                    <label className="form-check-label" htmlFor="randomSwitch">
                        Orden Aleatorio
                    </label>
                    <p className="form-check-p">
                        Baraja las palabras para estudiar mejor.
                    </p>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default OptionsModal;
