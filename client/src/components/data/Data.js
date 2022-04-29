import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import "./Data.css";
// contexts
import UserContext from "../../contexts/User";
// constants
import { BLOG_ROUTE, SIGN_IN_ROUTE, SIGN_UP_ROUTE, APPOINTMENT_ROUTE, APPOINTMENTS_ROUTE, HOME_ROUTE } from "../../constants/routes";
import { TOKEN_ENDPOINT } from "../../constants/endpoints";
// components
import Loader from "../loader/Loader";
// material-ui
import { useTheme } from "@mui/material/styles";
import { Button, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import PostAddRoundedIcon from "@mui/icons-material/PostAddRounded";
import VpnKeyRoundedIcon from "@mui/icons-material/VpnKeyRounded";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import Brightness4RoundedIcon from "@mui/icons-material/Brightness4Rounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import AssignmentIcon from "@mui/icons-material/Assignment";

const createData = (date, number) => {
    return { date, number };
};

const Data = ({ appointments, dark, handleDarkMode }) => {
    const history = useHistory();
    const theme = useTheme();
    const { user } = useContext(UserContext);
    const [data1, setData1] = useState([]);
    const [data2, setData2] = useState([]);
    const [data3, setData3] = useState([]);
    const [inProgress, setInProgress] = useState(false);

    useEffect(() => {
        try {
            setInProgress(true);
            const { token } = JSON.parse(localStorage.getItem("cc_task"));
            axios.post(TOKEN_ENDPOINT, { token }).then(res => {
                setInProgress(false);
                if(!res.data.name || res.data.professionalAffiliation !== "Counsellor")
                    history.push(HOME_ROUTE);
            }).catch(err => { setInProgress(false); history.push(SIGN_IN_ROUTE); });
        } catch (err) { setInProgress(false); history.push(SIGN_IN_ROUTE); }
    }, [history]);

    useEffect(() => {
        const newData1 = [];
        const newData2 = [];
        const newData3 = [];
        appointments.reverse().forEach((appointment, index) => {
            console.log(appointment.status);
            if (appointment.status)
                newData2.push(createData(new Date(appointment.updatedAt).toLocaleDateString(), newData2.length + 1));
            else
                newData3.push(createData(new Date(appointment.updatedAt).toLocaleDateString(), newData3.length + 1));
            newData1.push(createData(new Date(appointment.createdAt).toLocaleDateString(), index + 1));
        });
        setData1(newData1);
        setData2(newData2);
        setData3(newData3);
    }, [appointments]);

    const handleSignOut = () => {
        localStorage.removeItem("cc_task");
        history.push(SIGN_IN_ROUTE);
    };

    return (
        <div className="data">
            {inProgress ? <Loader /> : null}
            <div className="data__intro">
                <h1>Appointments' Data</h1>
                <p>The goal is to turn data into information, and information into insight.</p>
                <div className="data__introBtns">
                    <Button onClick={() => window.scrollTo(0, window.innerHeight - 75)}>View Data</Button>
                </div>
            </div>
            <h1 style={{ fontSize: "2em", color: "#008080", textAlign: "center", marginTop: "50px" }}>Appointments' Data</h1>
            {user?.professionalAffiliation === "Counsellor" ? <>
                <p style={{ marginLeft: "50px", marginTop: "20px", color: "grey" }}>Total Appointments: <span style={{ fontWeight: "bold", color: "#008080" }}>{appointments.length}</span></p>
                <ResponsiveContainer style={{ backgroundColor: "black" }}>
                    <LineChart data={data1}  >
                        <XAxis dataKey="date" stroke={theme.palette.text.secondary} style={theme.typography.body2} />
                        <YAxis stroke={theme.palette.text.secondary} style={theme.typography.body2}>
                            <Label angle={270} position="left" style={{ textAnchor: 'middle', fill: theme.palette.text.primary, ...theme.typography.body1, }}>Number of Appointments</Label>
                        </YAxis>
                        <Line type="monotone" dataKey="number" stroke={theme.palette.primary.main} />
                    </LineChart>
                </ResponsiveContainer>
                <h1 style={{ fontSize: "2em", color: "#008080", textAlign: "center", marginTop: "50px" }}>Pending Appointments</h1>
                <p style={{ marginLeft: "50px", marginTop: "20px", color: "grey" }}>Pending Appointments: <span style={{ fontWeight: "bold", color: "#008080" }}>{appointments.filter(a => a.status).length}</span></p>
                <ResponsiveContainer>
                    <LineChart data={data2}  >
                        <XAxis dataKey="date" stroke={theme.palette.text.secondary} style={theme.typography.body2} />
                        <YAxis stroke={theme.palette.text.secondary} style={theme.typography.body2}>
                            <Label angle={270} position="left" style={{ textAnchor: 'middle', fill: theme.palette.text.primary, ...theme.typography.body1, }}>Number of Appointments</Label>
                        </YAxis>
                        <Line type="monotone" dataKey="number" stroke={theme.palette.primary.main} />
                    </LineChart>
                </ResponsiveContainer>
                <h1 style={{ fontSize: "2em", color: "#008080", textAlign: "center", marginTop: "50px" }}>Completed Appointments</h1>
                <p style={{ marginLeft: "50px", marginTop: "20px", color: "grey" }}>Completed Appointments: <span style={{ fontWeight: "bold", color: "#008080" }}>{appointments.filter(a => !a.status).length}</span></p>
                <ResponsiveContainer>
                    <LineChart data={data3}  >
                        <XAxis dataKey="date" stroke={theme.palette.text.secondary} style={theme.typography.body2} />
                        <YAxis stroke={theme.palette.text.secondary} style={theme.typography.body2}>
                            <Label angle={270} position="left" style={{ textAnchor: 'middle', fill: theme.palette.text.primary, ...theme.typography.body1, }}>Number of Appointments</Label>
                        </YAxis>
                        <Line type="monotone" dataKey="number" stroke={theme.palette.primary.main} />
                    </LineChart>
                </ResponsiveContainer>
            </> : null}
            <SpeedDial ariaLabel="SpeedDial basic example" sx={{ position: 'fixed', right: 10, bottom: 10 }} icon={<SpeedDialIcon style={{ color: "white" }} />}>
                {user?.professionalAffiliation === "Student" ? <SpeedDialAction key={"Book an Appointment"} icon={<AssignmentIcon />} tooltipTitle={"Book an Appointment"} onClick={() => history.push(APPOINTMENT_ROUTE)} /> : null}
                {user?.professionalAffiliation === "Counsellor" ? <SpeedDialAction key={"Appointments"} icon={<PeopleAltRoundedIcon />} tooltipTitle={"Appointments"} onClick={() => history.push(APPOINTMENTS_ROUTE)} /> : null}
                <SpeedDialAction key={"Go to Blog"} icon={<PostAddRoundedIcon />} tooltipTitle={"Go to Blog"} onClick={() => history.push(BLOG_ROUTE)} />
                {!user ? <SpeedDialAction key={"Sign In"} icon={<VpnKeyRoundedIcon />} tooltipTitle={"Sign In"} onClick={() => history.push(SIGN_IN_ROUTE)} /> : null}
                {!user ? <SpeedDialAction key={"Sign Up"} icon={<PersonAddRoundedIcon />} tooltipTitle={"Sign Up"} onClick={() => history.push(SIGN_UP_ROUTE)} /> : null}
                {user ? <SpeedDialAction key={"Sign Out"} icon={<ExitToAppRoundedIcon />} tooltipTitle={"Sign Out"} onClick={() => handleSignOut()} /> : null}
                <SpeedDialAction key={dark ? "Light mode" : "Dark mode"} icon={dark ? <Brightness4RoundedIcon /> : <DarkModeRoundedIcon />} tooltipTitle={dark ? "Light mode" : "Dark mode"} onClick={() => handleDarkMode()} />
            </SpeedDial>
        </div>
    );
};

export default Data;