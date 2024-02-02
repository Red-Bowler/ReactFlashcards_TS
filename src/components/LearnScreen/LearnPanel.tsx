import OptionsButton from "./OptionsButton";
import BackButton from "../BackButton";
import { TermType } from "../../data/lectures";

const LearnPanel = (props: { showFunc: () => void, index: number, terms: TermType[], flip: boolean }) => {
    return (
        <div className="learnScreenPanel">
            <div className="panel">
                <OptionsButton showFunc={props.showFunc} />
                <p>
                    {props.index + 1}/{props.terms.length}
                </p>
                <BackButton options={{ currentScreen: "lecture" }} />
            </div>
            <div className="info">
                <p>
                    {props.flip
                        ? "Recordando significados en Japones"
                        : "Recordando significados en Español"}
                </p>
            </div>
        </div>
    );
};

export default LearnPanel;
