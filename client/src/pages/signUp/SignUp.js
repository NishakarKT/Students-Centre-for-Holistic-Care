import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import validator from "validator";
import emailjs from "@emailjs/browser";
import "./SignUp.css";
// utils
import { generateOtp, verifyOtp } from "../../utils/otp-ut";
// constants
import { CC_IITKGP_URL } from "../../constants/urls";
import { HOME_ROUTE, SIGN_IN_ROUTE, BLOG_ROUTE, PASS_RESET_ROUTE } from "../../constants/routes";
import { NEW_ENDPOINT, TOKEN_ENDPOINT } from "../../constants/endpoints";
// components
import Loader from "../../components/loader/Loader";
// material-ui
import { Avatar, Button, CssBaseline, TextField, Paper, Box, Grid, Typography, SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PostAddRoundedIcon from "@mui/icons-material/PostAddRounded";
import VpnKeyRoundedIcon from "@mui/icons-material/VpnKeyRounded";
import Brightness4RoundedIcon from "@mui/icons-material/Brightness4Rounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";


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

const SignUp = () => {
    const formRef = useRef(null);
    const containerRef = useRef(null);
    const history = useHistory();
    const [dark, setDark] = useState(JSON.parse(localStorage.getItem("cc_task"))?.dark || "");
    // states
    const [errorMsg, setErrorMsg] = useState("");
    const [otp, setOtp] = useState("");
    const [inputOtp, setInputOtp] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [contact, setContact] = useState("");
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");
    const [accessKey, setAccessKey] = useState("");
    const [loading, setLoading] = useState(false);
    // errors
    const [inputOtpErr, setInputOtpErr] = useState(false);
    const [nameErr, setNameErr] = useState(false);
    const [emailErr, setEmailErr] = useState(false);
    const [contactErr, setContactErr] = useState(false);
    const [passwordErr, setPasswordErr] = useState(false);
    const [confirmedPasswordErr, setConfirmedPasswordErr] = useState(false);

    useEffect(() => {
        try {
            const { token } = JSON.parse(localStorage.getItem("cc_task"));
            axios.post(TOKEN_ENDPOINT, { token }).then(res => history.push(HOME_ROUTE)).catch(err => { });
        } catch (err) { }
    }, [history]);

    const handleDarkMode = () => {
        const localData = JSON.parse(localStorage.getItem("cc_task")) || { token: "" };
        localStorage.setItem("cc_task", JSON.stringify({ ...localData, dark: !dark }));
        setDark(!dark);
    };

    const resetErrs = () => {
        setInputOtpErr(false);
        setNameErr(false);
        setEmailErr(false);
        setContactErr(false);
        setPasswordErr(false);
        setConfirmedPasswordErr(false);
    };

    const handleSubmit = e => {
        e.preventDefault();
        resetErrs();

        // error checks
        setNameErr(!name);
        setEmailErr(!(validator.isEmail(email) && (email.endsWith("@kgpian.iitkgp.ac.in") || email.endsWith("@iitkgp.ac.in"))));
        setContactErr(!contact);
        setPasswordErr(!password);
        setConfirmedPasswordErr(!confirmedPassword);

        if (password !== confirmedPassword) {
            setErrorMsg("Passwords did not match. Try again.");
            setPassword("");
            setConfirmedPassword("");
            setLoading(false);
        }
        else if (name && (validator.isEmail(email) && (email.endsWith("@kgpian.iitkgp.ac.in") || email.endsWith("iitkgp.ac.in"))) && contact && password && confirmedPassword) {
            if (otp === "verified") {
                setLoading(true);
                const signUpData = { name, professionalAffiliation: accessKey ? "Counsellor" : "Student", email, contact, password, accessKey };
                axios.post(NEW_ENDPOINT, signUpData).then(res => {
                    const token = res.data;
                    const localData = JSON.parse(localStorage.getItem("cc_task")) || { dark: false };
                    localStorage.setItem("cc_task", JSON.stringify({ ...localData, token }));
                    setErrorMsg("");
                    setLoading(false);
                    history.push(HOME_ROUTE);
                }).catch(err => {
                    setErrorMsg(err.response.data.errMsg);
                    setLoading(false);
                });
                // reset
                e.target.reset();
            }
            else if (otp === "sent") {
                if (verifyOtp(email, inputOtp)) {
                    setOtp("verified");
                    setInputOtpErr(false);
                    setLoading(true);
                    const signUpData = { name, professionalAffiliation: accessKey ? "Counsellor" : "Student", email, contact, password, accessKey };
                    axios.post(NEW_ENDPOINT, signUpData).then(res => {
                        const token = res.data;
                        const localData = JSON.parse(localStorage.getItem("cc_task")) || { dark: false };
                        localStorage.setItem("cc_task", JSON.stringify({ ...localData, token }));
                        setErrorMsg("");
                        setLoading(false);
                        history.push(HOME_ROUTE);
                    }).catch(err => {
                        setErrorMsg(err.response.data.errMsg);
                        setLoading(false);
                    });
                    // reset
                    e.target.reset();
                }
                else
                    setInputOtpErr(true);
            }
            else if ((validator.isEmail(email) && (email.endsWith("@kgpian.iitkgp.ac.in") || email.endsWith("iitkgp.ac.in")))) {
                setLoading(true);
                const generated_otp = generateOtp(email);
                emailjs.send('service_qnp9b0v', 'template_fxpsbf7', { to_name: name, from_name: "Counselling Centre", to_email: email, message: generated_otp }, 'Ke5Hv5jzpTlaNRExb')
                    .then((result) => {
                        setOtp("sent");
                        containerRef.current.scrollTop = containerRef.current.scrollHeight;
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
            <Grid container component="main" sx={{ height: '100vh' }} style={{ overflow: "hidden" }} className="signUp">
                <CssBaseline />
                <Grid ref={containerRef} item xs={12} sm={8} md={5} component={Paper} elevation={6} square style={{ height: "100vh", overflowX: "hidden", overflowY: "auto", color: dark ? "white" : "black", backgroundColor: dark ? "#192734" : "white" }} className="signUp__container">
                    <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Avatar sx={{ m: 1 }} style={{ backgroundColor: "#1976D2" }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign up
                        </Typography>
                        <Box component="form" ref={formRef} noValidate onSubmit={handleSubmit} sx={{ mt: 1, width: "100%" }}>
                            <TextField margin="normal" required fullWidth variant="standard" label="Name" value={name} error={nameErr} helperText={nameErr ? "Please, enter your name." : ""} onChange={e => setName(e.target.value)} autoFocus className={dark ? "signUp__darkTF" : ""} />
                            <TextField margin="normal" required fullWidth variant="standard" label="Email address" value={email} error={emailErr} helperText={emailErr ? "Please, enter your institute email address." : ""} onChange={e => setEmail(e.target.value)} className={dark ? "signUp__darkTF" : ""} />
                            <TextField margin="normal" required fullWidth variant="standard" label="Contact" value={contact} error={contactErr} helperText={contactErr ? "Please, enter your contact number." : ""} onChange={e => setContact(e.target.value)} className={dark ? "signUp__darkTF" : ""} />
                            <TextField margin="normal" required fullWidth variant="standard" label="Password" type="password" value={password} error={passwordErr} helperText={passwordErr ? "Please, enter your password." : ""} onChange={e => setPassword(e.target.value)} className={dark ? "signUp__darkTF" : ""} />
                            <TextField margin="normal" required fullWidth variant="standard" label="Confirm password" type="password" value={confirmedPassword} error={confirmedPasswordErr} helperText={confirmedPasswordErr ? "Please, enter your confirmed password." : ""} onChange={e => setConfirmedPassword(e.target.value)} className={dark ? "signUp__darkTF" : ""} />
                            <TextField margin="normal" fullWidth variant="standard" label="Access key (for Counsellors)" type="password" value={accessKey} onChange={e => setAccessKey(e.target.value)} className={dark ? "signUp__darkTF" : ""} />
                            {errorMsg ? <p className="signUp__errMsg">{errorMsg}</p> : null}
                            {otp === "sent" ? <TextField margin="normal" required fullWidth variant="standard" label="OTP" value={inputOtp} error={inputOtpErr} helperText={inputOtpErr ? "Please, enter the OTP sent to your institute email." : ""} onChange={e => setInputOtp(e.target.value)} className={dark ? "signUp__darkTF" : ""} /> : null}
                            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                                Sign UP
                            </Button>
                            <Grid container style={{ display: "flex", justifyContent: "space-between" }}>
                                <Grid item>
                                    <Link to={SIGN_IN_ROUTE} variant="body2" style={{ textDecoration: "none", color: dark ? "white" : "black" }}>{"Have an account?"}</Link>
                                </Grid>
                                <Grid item>
                                    <Link to={PASS_RESET_ROUTE} variant="body2" style={{ textDecoration: "none", color: dark ? "white" : "black" }}>{"Forgot Password?"}</Link>
                                </Grid>
                            </Grid>
                            <Copyright sx={{ mt: 5 }} style={{ color: dark ? "white" : "black" }} dark={dark} />
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={false} sm={4} md={7}
                    sx={{
                        backgroundImage: 'url(https://source.unsplash.com/1600x900/?help)',
                        help: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }} />
                <SpeedDial ariaLabel="SpeedDial basic example" sx={{ position: 'fixed', right: 10, bottom: 10 }} icon={<SpeedDialIcon style={{ color: "white" }} />}>
                    <SpeedDialAction key={"Go to Blog"} icon={<PostAddRoundedIcon />} tooltipTitle={"Go to Blog"} onClick={() => history.push(BLOG_ROUTE)} />
                    <SpeedDialAction key={"Sign In"} icon={<VpnKeyRoundedIcon />} tooltipTitle={"Sign In"} onClick={() => history.push(SIGN_IN_ROUTE)} />
                    <SpeedDialAction key={dark ? "Light mode" : "Dark mode"} icon={dark ? <Brightness4RoundedIcon /> : <DarkModeRoundedIcon />} tooltipTitle={dark ? "Light mode" : "Dark mode"} onClick={() => handleDarkMode()} />
                </SpeedDial>
            </Grid>
        </ThemeProvider>
    );
}

export default SignUp;