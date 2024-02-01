import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../context/AppContext";

const InfoHeader = () => {
    
    const [ context, _ ] = useContext(AppContext);

    const saveInfoMessage = context.saveInfoMessage;

    return (
        <div className="infoHeader">
            <div>{saveInfoMessage}</div>
        </div>
    );
};

export default InfoHeader;
