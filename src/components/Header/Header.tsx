import LoginHeader from "./LoginHeader";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

const Header = () => {
    const [ _, dispatch ] = useContext(AppContext);

    const handleClick = () => {
        // dispatch({ type: "CHANGE_SCREEN", payload: { currentScreen: "main" } });
        (window.location.reload as (cache: boolean) => void)(false);  // https://stackoverflow.com/questions/72730685/window-location-reloadfalse-migration-from-typescript-3-to-typescript-4
    };

    return (
        <header className="header">
            <h1 className="pageTitle" onClick={handleClick}>
                -Renshuu-
            </h1>
            <LoginHeader />
        </header>
    );
};

export default Header;
