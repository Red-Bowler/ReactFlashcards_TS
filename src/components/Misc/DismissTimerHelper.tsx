import { useEffect } from "react";

const DismissTimerHelper = (props: { hideFunc: () => void }) => {
    useEffect(() => {
        console.log("start timer");
        const timer = setTimeout(() => props.hideFunc(), 1000);

        return () => clearInterval(timer);
    }, []);
    return <></>;
};

export default DismissTimerHelper;
