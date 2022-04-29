import React from "react";
import "./Loader.css";
// material-ui
import { CircularProgress } from "@mui/material";

const Loader = ({ progress }) => {
    return (
        <div className="loader">
            <div className="loader__component">
                <CircularProgress variant={progress ? "determinate" : "indeterminate"} value={progress} style={{ color: "white" }} />
                {progress ? <p className="loader__progress" style={{ left: progress === 100 ? "6px" : "10px" }}>{progress}</p> : null}
            </div>
        </div>
    );
};

export default Loader;
