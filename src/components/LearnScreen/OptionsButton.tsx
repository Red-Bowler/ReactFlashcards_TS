const OptionsButton = (props: { showFunc: () => void }) => {
    return (
        <button className="optionsButton" onClick={props.showFunc}>
            Opciones
        </button>
    );
};

export default OptionsButton;
