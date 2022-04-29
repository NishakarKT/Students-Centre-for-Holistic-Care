import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import validator from "validator";
import "./SignIn.css";
// constants
import { CC_IITKGP_URL } from "../../constants/urls";
import { HOME_ROUTE, SIGN_UP_ROUTE, BLOG_ROUTE, PASS_RESET_ROUTE } from "../../constants/routes";
import { AUTH_ENDPOINT, TOKEN_ENDPOINT } from "../../constants/endpoints";
// components
import Loader from "../../components/loader/Loader";
// material-ui
import { Avatar, Button, CssBaseline, TextField, Paper, Box, Grid, Typography, SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PostAddRoundedIcon from '@mui/icons-material/PostAddRounded';
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
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

const SignIn = () => {
    const history = useHistory();
    const [dark, setDark] = useState(JSON.parse(localStorage.getItem("cc_task"))?.dark || false);
    // states
    const [errorMsg, setErrorMsg] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    // errors
    const [emailErr, setEmailErr] = useState(false);
    const [passwordErr, setPasswordErr] = useState(false);

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

    const handleSubmit = e => {
        e.preventDefault();

        // error checks
        setEmailErr(!validator.isEmail(email));
        setPasswordErr(!password);

        if (validator.isEmail(email) && password) {
            setLoading(true);
            const signInData = { email, password };

            axios.post(AUTH_ENDPOINT, signInData).then(res => {
                const token = res.data;
                const localData = JSON.parse(localStorage.getItem("cc_task")) || { dark: false };
                localStorage.setItem("cc_task", JSON.stringify({ ...localData, token }));
                setLoading(false);
                history.push(HOME_ROUTE);
            }).catch(err => { setErrorMsg(err.response.data.errMsg); setLoading(false); });

            // reset
            e.target.reset();
        }
    };

    return (
        <ThemeProvider theme={theme}>
            {loading ? <Loader /> : null}
            <Grid container component="main" sx={{ height: '100vh' }} style={{ overflow: "hidden" }} className="signIn" >
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
                    <SpeedDialAction key={dark ? "Light mode" : "Dark mode"} icon={dark ? <Brightness4RoundedIcon /> : <DarkModeRoundedIcon />} tooltipTitle={dark ? "Light mode" : "Dark mode"} onClick={() => handleDarkMode()} />
                </SpeedDial>
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square style={{ height: "100vh", overflowX: "hidden", overflowY: "auto", color: dark ? "white" : "black", backgroundColor: dark ? "#192734" : "white" }} className="signIn__container" >
                    <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Avatar sx={{ m: 1 }} style={{ backgroundColor: "#1976D2" }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, width: "100%" }}>
                            <TextField margin="normal" required fullWidth id="email" variant="standard" label="Email address" value={email} error={emailErr} helperText={emailErr ? "Please, enter your proper email address." : ""} onChange={e => setEmail(e.target.value)} autoFocus className={dark ? "signIn__darkTF" : ""} />
                            <TextField margin="normal" required fullWidth variant="standard" label="Password" type="password" id="password" value={password} error={passwordErr} helperText={passwordErr ? "Please, enter your password." : ""} onChange={e => setPassword(e.target.value)} className={dark ? "signIn__darkTF" : ""} />
                            {errorMsg ? <p className="signIn__errMsg">{errorMsg}</p> : null}
                            <Button type="submit" fullWidth variant="contained" sx={{ mt: 1, mb: 2 }}>
                                Sign In
                            </Button>
                            <Grid container style={{ display: "flex", justifyContent: "space-between" }}>
                                <Grid item>
                                    <Link to={SIGN_UP_ROUTE} variant="body2" style={{ textDecoration: "none", color: dark ? "white" : "black" }}>{"Don't have an account?"}</Link>
                                </Grid>
                                <Grid item>
                                    <Link to={PASS_RESET_ROUTE} variant="body2" style={{ textDecoration: "none", color: dark ? "white" : "black" }}>{"Forgot Password?"}</Link>
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

export default SignIn;