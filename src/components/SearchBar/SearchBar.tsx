import { useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";

const SearchBar = () => {
    const [ context, _] = useContext(AppContext);

    const lectures = context.lectures;

    console.log("🚀 ~ SearchBar ~ lectures:", lectures);
    const [value, setValue] = useState("");
    const [results, setResults] = useState<Result[]>([]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    type Result = { name: string, id: number, term: string, extra: string, answer: string };

    const handleSearch = () => {
        if (value === "") {
            return;
        }

        const resultsArray = [] as Result[];
        lectures.forEach((lecture) => {
            const lectureName = lecture.name;
            lecture.termList.forEach((term) => {
                if (term.answer.toLowerCase().includes(value.toLowerCase())) {
                    resultsArray.push({ name: lectureName, ...term } as Result);
                }
            });
        });

        setResults(resultsArray);
    };

    const handleClear = () => {
        setValue("");
        setResults([]);
    };

    const resultsElem = results.map((elem) => {
        return (
            <div className="resultElem">
                <div className="name">{elem.name}</div>
                <div className="term">{elem.term}</div>
                <div className="extra">{elem.extra}</div>
                <div className="answer">{elem.answer}</div>
            </div>
        );
    });

    return (
        <div className="searchBar">
            <div className="searchInput">
                <label>Busqueda Rapida: </label>
                <input
                    type="text"
                    value={value}
                    onChange={handleChange}
                ></input>
                <button className="searchButton" onClick={handleSearch}>
                    Buscar
                </button>
                <button onClick={handleClear}>X</button>
            </div>
            <div className="resultList">{resultsElem}</div>
        </div>
    );
};

export default SearchBar;
