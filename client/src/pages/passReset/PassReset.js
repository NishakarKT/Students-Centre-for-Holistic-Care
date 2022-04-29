import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import validator from "validator";
import emailjs from "@emailjs/browser";
import "./PassReset.css";
// utils
import { generateOtp, verifyOtp } from "../../utils/otp-ut";
// constants
import { CC_IITKGP_URL } from "../../constants/urls";
import { HOME_ROUTE, SIGN_IN_ROUTE, SIGN_UP_ROUTE, APPOINTMENT_ROUTE, BLOG_ROUTE } from "../../constants/routes";
import { PASS_RESET_ENDPOINT, TOKEN_ENDPOINT } from "../../constants/endpoints";
// components
import Loader from "../../components/loader/Loader";
// material-ui
import { Avatar, Button, CssBaseline, TextField, Paper, Box, Grid, Typography, SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PostAddRoundedIcon from '@mui/icons-material/PostAddRounded';
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Brightness4RoundedIcon from "@mui/icons-material/Brightness4Rounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import VpnKeyRoundedIcon from "@mui/icons-material/VpnKeyRounded";

const Copyright = props => {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <a color="inherit" href={CC_IITKGP_URL} target="_blank" rel="noreferrer" style={{ textDecoration: "none", color: props.dark ? "white" : "black" }}>
                Counselling Centre - IIT Kharagpur
            </a>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createTheme();

const PassReset = () => {
    const history = useHistory();
    const [dark, setDark] = useState(JSON.parse(localStorage.getItem("cc_task"))?.dark || false);
    // states
    const [name, setName] = useState("User");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [inputOtp, setInputOtp] = useState("");
    const [pass, setPass] = useState("");
    const [cnfrmPass, setCnfrmPass] = useState("");
    const [loading, setLoading] = useState(false);
    // errors
    const [emailErr, setEmailErr] = useState(false);
    const [inputOtpErr, setInputOtpErr] = useState(false);
    const [passErr, setPassErr] = useState("");
    const [cnfrmPassErr, setCnfrmPassErr] = useState("");

    useEffect(() => {
        try {
            setLoading(true);
            const { token } = JSON.parse(localStorage.getItem("cc_task"));
            axios.post(TOKEN_ENDPOINT, { token }).then(res => {
                setLoading(false);
                history.push(HOME_ROUTE);
            }).catch(err => { setLoading(false); });
        } catch (err) { setLoading(false); }
    }, [history]);

    const handleDarkMode = () => {
        const localData = JSON.parse(localStorage.getItem("cc_task")) || { token: "" };
        localStorage.setItem("cc_task", JSON.stringify({ ...localData, dark: !dark }));
        setDark(!dark);
    };

    const resetErrs = () => {
        setInputOtpErr(false);
        setEmailErr(false);
        setPassErr(false);
        setCnfrmPassErr(false);
    };

    const handleSubmit = e => {
        e.preventDefault();
        resetErrs();

        // error checks
        setEmailErr(!validator.isEmail(email));

        if (pass !== cnfrmPass) {
            setPass("");
            setCnfrmPass("");
            setPassErr(true);
            setCnfrmPassErr(true);
        }
        else if (validator.isEmail(email)) {
            setLoading(true);

            if (otp === "verified") {
                const passResetData = { email, pass };
                axios.patch(PASS_RESET_ENDPOINT, passResetData).then(res => {
                    const token = res.data;
                    const localData = JSON.parse(localStorage.getItem("cc_task")) || { dark: false };
                    localStorage.setItem("cc_task", JSON.stringify({ ...localData, token }));
                    setLoading(false);
                    history.push(HOME_ROUTE);
                }).catch(err => {
                    setLoading(false);
                });
                // reset
                e.target.reset();
            }
            else if (otp === "sent") {
                if (verifyOtp(email, inputOtp)) {
                    setOtp("verified");
                    setInputOtpErr(false);
                    setLoading(false);
                }
                else {
                    setInputOtpErr(true);
                    setLoading(false);
                }
            }
            else {
                const generated_otp = generateOtp(email);
                emailjs.send('service_qnp9b0v', 'template_fxpsbf7', { to_name: name, to_email: email, message: generated_otp }, 'Ke5Hv5jzpTlaNRExb')
                    .then((result) => {
                        setOtp("sent");
                        setLoading(false);
                    }, (error) => {
                        setOtp("");
                        setLoading(false);
                    });
            }
        }
    };

    return (
        <ThemeProvider theme={theme}>
            {loading ? <Loader /> : null}
            <Grid container component="main" sx={{ height: '100vh' }} style={{ overflow: "hidden" }} className="passReset" >
                <CssBaseline />
                <Grid item xs={false} sm={4} md={7}
                    sx={{
                        backgroundImage: 'url(https://source.unsplash.com/1600x900/?counselling)',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }} />
                <SpeedDial ariaLabel="SpeedDial basic example" sx={{ position: 'fixed', left: 10, bottom: 10 }} icon={<SpeedDialIcon style={{ color: "white" }} />}>
                    <SpeedDialAction key={"Go to Blog"} icon={<PostAddRoundedIcon />} tooltipTitle={"Go to Blog"} onClick={() => history.push(BLOG_ROUTE)} />
                    <SpeedDialAction key={"Sign Up"} icon={<PersonAddRoundedIcon />} tooltipTitle={"Sign Up"} onClick={() => history.push(SIGN_UP_ROUTE)} />
                    <SpeedDialAction key={"Sign In"} icon={<VpnKeyRoundedIcon />} tooltipTitle={"Sign In"} onClick={() => history.push(SIGN_IN_ROUTE)} />
                    <SpeedDialAction key={dark ? "Light mode" : "Dark mode"} icon={dark ? <Brightness4RoundedIcon /> : <DarkModeRoundedIcon />} tooltipTitle={dark ? "Light mode" : "Dark mode"} onClick={() => handleDarkMode()} />
                </SpeedDial>
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square style={{ height: "100vh", overflowX: "hidden", overflowY: "auto", color: dark ? "white" : "black", backgroundColor: dark ? "#192734" : "white" }} className="passReset__container" >
                    <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Avatar sx={{ m: 1 }} style={{ backgroundColor: "#1976D2" }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Forgot Password?
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, width: "100%" }}>
                            <TextField margin="normal" required fullWidth id="email" variant="standard" label="Email address" value={email} error={emailErr} disabled={otp === "sent" || otp === "verified"} helperText={emailErr ? "Please, enter your proper email address." : ""} onChange={e => setEmail(e.target.value)} autoFocus className={dark ? "passReset__darkTF" : ""} />
                            {otp === "sent" ? <TextField margin="normal" required fullWidth id="otp" variant="standard" label="OTP" value={inputOtp} error={inputOtpErr} helperText={inputOtpErr ? "Please, enter the OTP sent to your institute email." : ""} onChange={e => setInputOtp(e.target.value)} className={dark ? "passReset__darkTF" : ""} /> : null}
                            {otp === "verified" ? <TextField margin="normal" required fullWidth id="pass" variant="standard" label="New Password" type="password" value={pass} error={passErr} helperText={passErr ? "Please, enter your new password that matches the confirmed password." : ""} onChange={e => setPass(e.target.value)} className={dark ? "passReset__darkTF" : ""} /> : null}
                            {otp === "verified" ? <TextField margin="normal" required fullWidth id="cnfrmPass" variant="standard" label="Confirmed Password" type="password" value={cnfrmPass} error={cnfrmPassErr} helperText={cnfrmPassErr ? "Please, enter your confirmed password that matches the new password." : ""} onChange={e => setCnfrmPass(e.target.value)} className={dark ? "passReset__darkTF" : ""} /> : null}
                            <Button type="submit" fullWidth variant="contained" sx={{ mt: 1, mb: 2 }}>
                                {otp === "verified" ? "Change Password" : "Generate OTP"}
                            </Button>
                            <Grid container style={{ display: "flex", justifyContent: "space-between" }}>
                                <Grid item>
                                    <Link to={SIGN_IN_ROUTE} variant="body2" style={{ textDecoration: "none", color: dark ? "white" : "black" }}>{"Have an account?"}</Link>
                                </Grid>
                                <Grid item>
                                    <Link to={SIGN_UP_ROUTE} variant="body2" style={{ textDecoration: "none", color: dark ? "white" : "black" }}>{"Don't have an account?"}</Link>
                                </Grid>
                            </Grid>
                            <Copyright sx={{ mt: 5 }} style={{ color: dark ? "white" : "black" }} dark={dark} />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

export default PassReset;