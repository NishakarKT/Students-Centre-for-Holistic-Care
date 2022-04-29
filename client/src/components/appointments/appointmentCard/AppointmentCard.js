import React, { useState, useRef } from "react";
import "./AppointmentCard.css";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
// components
import Loader from "../../loader/Loader";
// constants
import { UPDATE_APPOINTMENT_ENDPOINT } from "../../../constants/endpoints";
// mmaterial-ui
import { Button } from "@mui/material";

const AppointmentCard = ({ appointment, dark }) => {
    const reCaptchaRef = useRef();
    const [inProgress, setInProgress] = useState(false);
    const [verified, setVerified] = useState(false);
    const [reCaptchaState, setReCaptchaState] = useState(false);

    const handleReCaptcha = async token => {
        setVerified(true);
        // axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=6Lcc2w0fAAAAAAO4txrx8wHnnsLVubQaDvWQS1Ag&response=${token}`, {}, { headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" } })
        //     .then(res => console.log(res))
        //     .catch(err => console.log(err));
    };

    const updateStatus = async (_id, status) => {
        if (verified) {
            setInProgress(true);
            try {
                axios.patch(UPDATE_APPOINTMENT_ENDPOINT, { _id, status })
                    .then(() => { setInProgress(false); setVerified(false); setReCaptchaState(false); window.location.reload(); })
                    .catch(() => { setInProgress(false); setVerified(false); setReCaptchaState(false); window.location.reload(); })
            } catch (err) { setInProgress(false); setVerified(false); setReCaptchaState(false); window.location.reload(); }
        }
        else {
            setReCaptchaState(true);
        }
    };

    return (
        <div className="appointmentCard" style={{ backgroundColor: dark ? "#15202B" : "white" }}>
            {inProgress ? <Loader /> : null}
            {appointment?.firstName ? <p style={{ color: dark ? "white" : "black" }}><b>Name:</b> {appointment.firstName + " " + appointment.lastName}</p> : null}
            {appointment?.roll ? <p style={{ color: dark ? "white" : "black" }}><b>Roll ID:</b> {appointment.roll}</p> : null}
            {appointment.email ? <p style={{ color: dark ? "white" : "black" }}><b>Email:</b> {appointment.email}</p> : null}
            {appointment.date ? <p style={{ color: dark ? "white" : "black" }}><b>Date (M/D/Y):</b> {appointment.date}</p> : null}
            <p style={{ color: dark ? "white" : "black" }}><b>Status:</b> {appointment.status || "Completed"}</p>
            {appointment.detail ? <p style={{ color: dark ? "white" : "black" }}><b>Reason:</b> {appointment.detail}</p> : null}
            {reCaptchaState ? <ReCAPTCHA sitekey="6Lcc2w0fAAAAAORgyfFLqImaPBK44FfPaBINRgXH" ref={reCaptchaRef} onChange={token => handleReCaptcha(token)} /> : null}
            {appointment.status === "pending" ? <div className="appointmentCard__buttons">
                <Button onClick={() => updateStatus(appointment._id, "completed")} style={{ backgroundColor: verified ? "green" : "grey" }}>Mark as Complete</Button>
                <Button onClick={() => window.open("mailto:" + appointment.email)} style={{ marginLeft: "10px", backgroundColor: "#1976d2" }}>Mail</Button>
            </div> : null}
        </div>
    );
};

export default AppointmentCard;
