import React, { useState,useEffect, useContext } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "./Appointments.css";
// constants
import { BLOG_ROUTE, SIGN_IN_ROUTE, SIGN_UP_ROUTE, APPOINTMENT_ROUTE, DATA_ROUTE, HOME_ROUTE } from "../../../constants/routes";
import { TOKEN_ENDPOINT} from "../../../constants/endpoints";
// components
import AppointmentCard from "../appointmentCard/AppointmentCard";
import SearchBox from "../../blog/searchBox/SearchBox";
import Loader from "../../loader/Loader";
// material-ui
import { Button, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import PostAddRoundedIcon from "@mui/icons-material/PostAddRounded";
import VpnKeyRoundedIcon from "@mui/icons-material/VpnKeyRounded";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import Brightness4RoundedIcon from "@mui/icons-material/Brightness4Rounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import AssignmentIcon from "@mui/icons-material/Assignment";
// contexts
import UserContext from "../../../contexts/User";

const Appointments = ({ appointments, dark, handleDarkMode }) => {
    const history = useHistory();
    const { user } = useContext(UserContext);
    const [search, setSearch] = useState("");
    const [inProgress, setInProgress] = useState(false);

    useEffect(() => {
        try {
            setInProgress(true);
            const { token } = JSON.parse(localStorage.getItem("cc_task"));
            axios.post(TOKEN_ENDPOINT, { token }).then(res => {
                setInProgress(false);
                if (!res.data.name || res.data.professionalAffiliation !== "Counsellor")
                    history.push(HOME_ROUTE);
            }).catch(err => { setInProgress(false); history.push(SIGN_IN_ROUTE); });
        } catch (err) { setInProgress(false); history.push(SIGN_IN_ROUTE); }
    }, [history]);

    const handleSignOut = () => {
        localStorage.removeItem("cc_task");
        history.push(SIGN_IN_ROUTE);
    };

    const getObjStr = (obj) => {
        let str = "";
        Object.keys(obj).map(key => str += obj[key]);
        return str.replaceAll(" ", "");
    };

    return (
        <div className="appointments" style={dark ? { backgroundColor: "#192734" } : {}}>
            {inProgress ? <Loader /> : null}
            <div className="appointments__intro">
                <h1>Appointments</h1>
                <p>The purpose of life is not to be happy. It is to be useful, to be honorable, to be compassionate, to have it make some difference that you have lived and lived well.</p>
                <div className="appointments__introButtons">
                    <Button onClick={() => window.scrollTo(0, window.innerHeight - 75)}>Go through appointments</Button>
                </div>
            </div>
            <div className="appointments__collection">
                <SearchBox setSearch={setSearch} />
                <p style={dark ? { color: "white", backgroundColor: "#15202B" } : {}}><PeopleAltRoundedIcon style={dark ? { color: "white" } : {}} />Appointments</p>
                {user?.professionalAffiliation === "Counsellor" ? appointments.filter(appointment => getObjStr(appointment).toLowerCase().includes(search.toLowerCase().replaceAll(" ", ""))).map((appointment, index) => <AppointmentCard key={index} appointment={appointment} dark={dark} />) :  null}
            </div>
            <SpeedDial ariaLabel="SpeedDial basic example" sx={{ position: 'fixed', right: 10, bottom: 10 }} icon={<SpeedDialIcon style={{ color: "white" }} />}>
                <SpeedDialAction key={"Go to Blog"} icon={<PostAddRoundedIcon />} tooltipTitle={"Go to Blog"} onClick={() => history.push(BLOG_ROUTE)} />
                {user?.professionalAffiliation === "Student" ? <SpeedDialAction key={"Book an Appointment"} icon={<AssignmentIcon />} tooltipTitle={"Book an Appointment"} onClick={() => history.push(APPOINTMENT_ROUTE)} /> : null}
                {user?.professionalAffiliation === "Counsellor" ? <SpeedDialAction key={"Data"} icon={<BarChartRoundedIcon />} tooltipTitle={"Data"} onClick={() => history.push(DATA_ROUTE)} /> : null}
                {!user ? <SpeedDialAction key={"Sign In"} icon={<VpnKeyRoundedIcon />} tooltipTitle={"Sign In"} onClick={() => history.push(SIGN_IN_ROUTE)} /> : null}
                {!user ? <SpeedDialAction key={"Sign Up"} icon={<PersonAddRoundedIcon />} tooltipTitle={"Sign Up"} onClick={() => history.push(SIGN_UP_ROUTE)} /> : null}
                {user ? <SpeedDialAction key={"Sign Out"} icon={<ExitToAppRoundedIcon />} tooltipTitle={"Sign Out"} onClick={() => handleSignOut()} /> : null}
                <SpeedDialAction key={dark ? "Light mode" : "Dark mode"} icon={dark ? <Brightness4RoundedIcon /> : <DarkModeRoundedIcon />} tooltipTitle={dark ? "Light mode" : "Dark mode"} onClick={() => handleDarkMode()} />
            </SpeedDial>
        </div>
    );
};

export default Appointments;
