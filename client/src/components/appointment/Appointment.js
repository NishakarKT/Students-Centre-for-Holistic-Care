import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import validator from "validator";
import "./Appointment.css";
// constants
import { APPOINTMENTS_ROUTE, BLOG_ROUTE, SIGN_IN_ROUTE, SIGN_UP_ROUTE, DATA_ROUTE } from "../../constants/routes";
import { BOOK_APPOINTMENT_ENDPOINT, TOKEN_ENDPOINT } from "../../constants/endpoints";
// components
import Loader from "../loader/Loader";
// material ui
import { TextField, Checkbox, Button, SpeedDial, SpeedDialAction, SpeedDialIcon, Snackbar, Alert, TextareaAutosize } from "@mui/material";
import { LocalizationProvider, MobileDateTimePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import VpnKeyRoundedIcon from "@mui/icons-material/VpnKeyRounded";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import PostAddRoundedIcon from "@mui/icons-material/PostAddRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import Brightness4RoundedIcon from "@mui/icons-material/Brightness4Rounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
// contexts
import UserContext from "../../contexts/User";

const Appointment = ({ dark, handleDarkMode }) => {
    const history = useHistory();
    const { user } = useContext(UserContext);
    // states
    const [inProgress, setInProgress] = useState(false);
    const [alert, setAlert] = useState(false);
    const [iAgree, setIAgree] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [rollNum, setRollNum] = useState("");
    const [email, setEmail] = useState("");
    const [detail, setDetail] = useState("");
    const [date, setDate] = useState(new Date().toLocaleString());
    // errors
    const [firstNameErr, setFirstNameErr] = useState(false);
    const [lastNameErr, setLastNameErr] = useState(false);
    const [rollNumErr, setRollNumErr] = useState(false);
    const [emailErr, setEmailErr] = useState(false);
    // disable browser auto-complete
    const disableAutoComplete = { autoComplete: "new-password", form: { autoComplete: "off" } };

    useEffect(() => {
        try {
            setInProgress(true);
            const { token } = JSON.parse(localStorage.getItem("cc_task"));
            axios.post(TOKEN_ENDPOINT, { token }).then(res => {
                setInProgress(false);
            }).catch(err => { setInProgress(false); history.push(SIGN_IN_ROUTE); });
        } catch (err) { setInProgress(false); history.push(SIGN_IN_ROUTE); }
    }, [history]);

    const handleSignOut = () => {
        localStorage.removeItem("cc_task");
        history.push(SIGN_IN_ROUTE);
    };

    const handleAppointment = e => {
        e.preventDefault();

        // error checks
        setFirstNameErr(!firstName);
        setLastNameErr(!lastName);
        setRollNumErr(!rollNum);
        setEmailErr(!validator.isEmail(email));
        setErrorMsg(!detail ? "Please, enter a reason for appointment." : "");

        // email check
        setErrorMsg(!validator.isEmail(email) ? "Please, enter a proper email." : "");

        // appointment
        if (firstName && lastName && rollNum && validator.isEmail(email) && detail && iAgree) {
            setInProgress(true);
            const data = { firstName, lastName, rollNum, email, detail, date: date.toLocaleString(), status: "pending" }

            try {
                axios.post(BOOK_APPOINTMENT_ENDPOINT, data)
                    .then(() => { setInProgress(false); setAlert(true) })
                    .catch(() => { setInProgress(false); });
            } catch (err) { setInProgress(false); }

            clearForm();
        }
    };

    const clearForm = () => {
        setErrorMsg("");
        setFirstName("");
        setLastName("");
        setRollNum("");
        setEmail("");
        setDetail("");
        setIAgree(false);
        setDate(new Date().toLocaleString());
        setIAgree(false);
    };

    return (
        <div className="appointment" style={dark ? { backgroundColor: "#192734" } : {}}>
            {inProgress ? <Loader /> : null}
            <Snackbar open={alert} autoHideDuration={10000} onClose={() => setAlert(false)}>
                <Alert onClose={() => setAlert(false)} severity="success" sx={{ width: "100%" }}>Appointment booked!</Alert>
            </Snackbar>
            <div className="appointment__intro">
                <h1>Book an Appointment, today!</h1>
                <p>A big part of depression is feeling really lonely, even if you’re in a room full of a million people. Book an appointment with our counsellors today.</p>
                <div className="appointment__introButtons">
                    <Button onClick={() => window.scrollTo(0, window.innerHeight - 75)}>Book an appointment!</Button>
                </div>
            </div>
            <div className="appointment__collection">
                <p style={dark ? { color: "white", backgroundColor: "#15202B" } : {}}><PeopleAltRoundedIcon style={dark ? { color: "white" } : {}} />Book an Appointment</p>
            </div>
            <form className="appointment__form" style={{ marginTop: "-50px" }} onSubmit={e => handleAppointment(e)}>
                <div className="appointment__info">
                    <TextField variant="standard" label="First Name" error={firstNameErr} helperText={firstNameErr ? "Please, enter your first name." : ""} value={firstName} onChange={e => setFirstName(e.target.value)} style={{ marginRight: "10px" }} inputProps={disableAutoComplete} className={dark ? "appointment__darkTF" : ""} />
                    <TextField variant="standard" label="Last Name" error={lastNameErr} helperText={lastNameErr ? "Please, enter your last name." : ""} value={lastName} onChange={e => setLastName(e.target.value)} style={{ marginLeft: "10px" }} inputProps={disableAutoComplete} className={dark ? "appointment__darkTF" : ""} />
                </div>
                <div className="appointment__info">
                    <TextField variant="standard" label="Email" error={emailErr} helperText={emailErr ? "Please, enter your proper email." : ""} value={email} onChange={e => setEmail(e.target.value)} style={{ marginRight: "10px" }} inputProps={disableAutoComplete} className={dark ? "appointment__darkTF" : ""} />
                    <TextField variant="standard" label="Roll Number" error={rollNumErr} helperText={rollNumErr ? "Please, enter your roll number." : ""} value={rollNum} onChange={e => setRollNum(e.target.value)} style={{ marginLeft: "10px" }} inputProps={disableAutoComplete} className={dark ? "appointment__darkTF" : ""} />
                </div>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <MobileDateTimePicker
                        value={date}
                        onChange={date => {
                            setDate(date);
                        }}
                        renderInput={(params) => <TextField {...params} variant="standard" style={{ width: "100%", margin: "10px" }} className={dark ? "appointment__darkTF" : ""} />}
                    />
                </LocalizationProvider>
                <div className="appointment__detail" style={{ width: "100%" }}>
                    <TextareaAutosize aria-label="minimum height" placeholder="Describe the need for consultation." value={detail} onChange={e => setDetail(e.target.value)} className={dark ? "appointment__darkTA" : ""} />
                </div>
                <div style={{ textAlign: "left", marginBottom: "10px", color: "red" }}>
                    <Checkbox onChange={e => setIAgree(e.target.checked)} style={{ width: "10px", height: "10px", marginRight: "5px" }} />
                    I agree to the terms and conditions that the appointment information shall be used to contact the user only. User's data such as name, roll number and email shall be removed once the appointment completes.
                </div>
                {errorMsg ? <p className="appointment__errMsg">{errorMsg}</p> : null}
                <div className="appointment__buttons">
                    <Button style={{ marginRight: "2.5px", backgroundColor: "grey" }} onClick={() => clearForm()}>Clear</Button>
                    <Button disabled={!iAgree} type="submit" style={{ marginLeft: "2.5px", backgroundColor: iAgree ? "teal" : "grey" }}>Submit</Button>
                </div>
            </form>
            <SpeedDial ariaLabel="SpeedDial basic example" sx={{ position: 'fixed', right: 10, bottom: 10 }} icon={<SpeedDialIcon style={{ color: "white" }} />}>
                <SpeedDialAction key={"Go to Blog"} icon={<PostAddRoundedIcon />} tooltipTitle={"Go to Blog"} onClick={() => history.push(BLOG_ROUTE)} />
                {user?.professionalAffiliation === "Counsellor" ? <SpeedDialAction key={"Appointments"} icon={<PeopleAltRoundedIcon />} tooltipTitle={"Appointments"} onClick={() => history.push(APPOINTMENTS_ROUTE)} /> : null}
                {user?.professionalAffiliation === "Counsellor" ? <SpeedDialAction key={"Data"} icon={<BarChartRoundedIcon />} tooltipTitle={"Data"} onClick={() => history.push(DATA_ROUTE)} /> : null}
                {!user ? <SpeedDialAction key={"Sign In"} icon={<VpnKeyRoundedIcon />} tooltipTitle={"Sign In"} onClick={() => history.push(SIGN_IN_ROUTE)} /> : null}
                {!user ? <SpeedDialAction key={"Sign Up"} icon={<PersonAddRoundedIcon />} tooltipTitle={"Sign Up"} onClick={() => history.push(SIGN_UP_ROUTE)} /> : null}
                {user ? <SpeedDialAction key={"Sign Out"} icon={<ExitToAppRoundedIcon />} tooltipTitle={"Sign Out"} onClick={() => handleSignOut()} /> : null}
                <SpeedDialAction key={dark ? "Light mode" : "Dark mode"} icon={dark ? <Brightness4RoundedIcon /> : <DarkModeRoundedIcon />} tooltipTitle={dark ? "Light mode" : "Dark mode"} onClick={() => handleDarkMode()} />
            </SpeedDial>
        </div>
    );
};

export default Appointment;
