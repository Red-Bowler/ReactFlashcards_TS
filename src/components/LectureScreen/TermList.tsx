import { LectureType, TermType } from "../../data/lectures";
import TermItem from "./TermItem";

const TermList = (props: { lecture: LectureType }) => {
    const termItems = props.lecture.termList.map((term: TermType) => {
        return (
            <TermItem
                key={term.id}
                term={term.term}
                extra={term.extra}
                answer={term.answer}
            ></TermItem>
        );
    });

    return <div className="termList">{termItems}</div>;
};

export default TermList;
