import "./App.css";
import Header from "./components/Header/Header";
import Main from "./components/Main";
// import "bootstrap/dist/css/bootstrap.min.css";
import { AppProvider } from "./context/AppContext";
import svg from "./svg/cherry-blossom-petal.svg";

function App() {
    const github = (
        <span>
            Ve este projecto en{" "}
            <a
                href="https://github.com/owaruuu/ReactFlashcards"
                target="_blank"
            >
                Github
            </a>
            .
        </span>
    );

    const linkedin = (
        <span>
            © por{" "}
            <a
                href="https://www.linkedin.com/in/josuemarquez/"
                target="_blank"
                rel="noopener noreferrer"
            >
                Josue Marquez
            </a>{" "}
            2023.
        </span>
    );

    return (
        <AppProvider>
            <div className="App">
                <Header />
                {/* <hr style={{ margin: 0 }}></hr> */}
                <Main />
                <div className="divider">
                    <img className="logo" src={svg}></img>
                </div>
                <footer>
                    {github}
                    {linkedin}
                </footer>
            </div>
        </AppProvider>
    );
}

export default App;
