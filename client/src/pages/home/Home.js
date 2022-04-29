import React, { useState, useEffect, Suspense, lazy } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import axios from "axios";
import "./Home.css";
// constants
import { TOKEN_ENDPOINT, GET_POSTS_ENDPOINT, GET_APPOINTMENTS_ENDPOINT } from "../../constants/endpoints";
import { BLOG_ROUTE, APPOINTMENT_ROUTE, APPOINTMENTS_ROUTE, DATA_ROUTE } from "../../constants/routes";
// components
import Nav from "../../components/nav/main/Nav";
import Loader from "../../components/loader/Loader"
import Footer from "../../components/footer/Footer"
import UserContext from "../../contexts/User";
// material-ui
import { IconButton } from "@mui/material";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";

// lazy components
const Blog = lazy(() => import("../../components/blog/main/Blog"));
const Appointment = lazy(() => import("../../components/appointment/Appointment"));
const Appointments = lazy(() => import("../../components/appointments/main/Appointments"));
const Data = lazy(() => import("../../components/data/Data"));

const Home = () => {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dark, setDark] = useState(JSON.parse(localStorage.getItem("cc_task"))?.dark || false);

    useEffect(() => {
        const handleScrollEvents = () => {
            const scrollToTopBtn = document.querySelector(".home__scrollToTopBtn");
            scrollToTopBtn.style.transform = window.scrollY > 10 ? "scale(1)" : "scale(0)";
        };

        document.addEventListener("scroll", handleScrollEvents);
        return () => document.removeEventListener("scroll", handleScrollEvents);
    }, [])

    useEffect(() => {
        try {
            setLoading(true);
            const { token } = JSON.parse(localStorage.getItem("cc_task"));
            axios.post(TOKEN_ENDPOINT, { token }).then(res => {
                setUser(res.data);
                setLoading(false);
            }).catch(err => { setLoading(false); });
        } catch (err) { setLoading(false); }

        try {
            setLoading(true);
            axios.get(GET_POSTS_ENDPOINT)
                .then(res => setPosts(res.data))
                .catch(err => { setLoading(false); });
        } catch (err) { setLoading(false); };

        try {
            setLoading(true);
            axios.get(GET_APPOINTMENTS_ENDPOINT)
                .then(res => {
                    setAppointments(res.data);
                    setLoading(false);
                })
                .catch(err => { setLoading(false); });
        } catch (err) { setLoading(false); };
    }, []);

    const handleDarkMode = () => {
        const localData = JSON.parse(localStorage.getItem("cc_task")) || { token: "" };
        localStorage.setItem("cc_task", JSON.stringify({ ...localData, dark: !dark }));
        setDark(!dark);
    };

    return (
        <UserContext.Provider value={{ user }}>
            {loading ? <Loader /> : null}
            <IconButton onClick={() => window.scrollTo(0, 0)} className="home__scrollToTopBtn" style={{ backgroundColor: dark ? "#15202B" : "#212613" }} ><ArrowUpwardRoundedIcon /></IconButton>
            <div className="home">
                <Nav dark={dark} />
                <Suspense fallback={<Loader />}>
                    <Switch>
                        <Route exact path={BLOG_ROUTE} component={() => <Blog posts={posts} setPosts={setPosts} dark={dark} handleDarkMode={handleDarkMode} />} />
                        <Route exact path={APPOINTMENT_ROUTE} component={() => <Appointment dark={dark} handleDarkMode={handleDarkMode} />} />
                        <Route exact path={APPOINTMENTS_ROUTE} component={() => <Appointments appointments={appointments} setAppointments={setAppointments} dark={dark} handleDarkMode={handleDarkMode} />} />
                        <Route exact path={DATA_ROUTE} component={() => <Data appointments={appointments} dark={dark} handleDarkMode={handleDarkMode} />} />
                        <Redirect to={BLOG_ROUTE} />
                    </Switch>
                </Suspense>
                <Footer dark={dark} />
            </div>
        </UserContext.Provider>
    );
};

export default Home;
