import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

const NextRedTermButton = (props: { func: () => void }) => {
    return (
        <button className="nextRedButton" onClick={props.func}>
            Next red term <MdOutlineKeyboardDoubleArrowRight />
        </button>
    );
};

export default NextRedTermButton;
