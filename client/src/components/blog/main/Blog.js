import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import "./Blog.css";
// constants
import { CC_IITKGP_URL } from "../../../constants/urls";
import { APPOINTMENTS_ROUTE, APPOINTMENT_ROUTE, SIGN_IN_ROUTE, SIGN_UP_ROUTE, DATA_ROUTE } from "../../../constants/routes";
// components
import Post from "../post/Post";
import NewPost from "../newPost/NewPost";
import PostCard from "../postCard/PostCard";
import SearchBox from "../searchBox/SearchBox";
import ImgList from "../imgList/ImgList";
// material-ui
import { Drawer, Button, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import VpnKeyRoundedIcon from "@mui/icons-material/VpnKeyRounded";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import AssignmentIcon from "@mui/icons-material/Assignment";
import TodayIcon from "@mui/icons-material/Today";
import EventIcon from "@mui/icons-material/Event";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import Brightness4RoundedIcon from "@mui/icons-material/Brightness4Rounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
// contexts
import UserContext from "../../../contexts/User";

const Blog = ({ posts, setPosts, dark, handleDarkMode }) => {
    const history = useHistory();
    const { user } = useContext(UserContext);
    const [post, setPost] = useState({});
    const [postState, setPostState] = useState(false);
    const [comments, setComments] = useState([]);
    const [search, setSearch] = useState("");

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
        <div className="blog" style={dark ? { backgroundColor: "#192734" } : {}}>
            <div className="blog__intro" style={{ marginBottom: user?.name ? "0px" : "50px" }}>
                <h1>Students' Centre for Holistic Care</h1>
                <p>A person's most beautiful useful asset is not a head full of knowledge, but a heart full of love, an ear ready to listen and a hand willing to help others.</p>
                <div className="blog__buttons">
                    <Button onClick={() => window.scrollTo(0, window.innerHeight - 75)}>Explore!</Button>
                    <Button onClick={() => window.open(CC_IITKGP_URL, "_blank")}>About us!</Button>
                </div>
            </div>
            <NewPost dark={dark} setPosts={setPosts} />
            <ImgList dark={dark} />
            <div className="blog__postCollection">
                <p style={dark ? { color: "white", backgroundColor: "#15202B", width: "100%" } : { width: "100%" }}><EventIcon style={dark ? { color: "white" } : {}} />Recent Posts</p>
                <div className="blog__posts">
                    {posts?.length ? posts.slice(0, 3).map((post, index) => <PostCard key={index} post={post} setPost={setPost} setPosts={setPosts} setPostState={setPostState} setComments={setComments} dark={dark} />) : <p style={{ fontSize: "20px", fontWeight: "600", textAlign: "center", color: dark ? "white" : "gray", margin: "50px 0" }}>No posts yet.</p>}
                </div>
            </div>
            <div className="blog__postCollection">
                <p style={dark ? { color: "white", backgroundColor: "#15202B", width: "100%" } : { width: "100%" }}><PeopleRoundedIcon style={dark ? { color: "white" } : {}} />Most Viewed</p>
                <div className="blog__posts" >
                    {posts?.length ? [...posts].sort((a, b) => b.views - a.views).slice(0, 3).map((post, index) => <PostCard key={index} post={post} setPost={setPost} setPosts={setPosts} setPostState={setPostState} setComments={setComments} fullWidth dark={dark} />) : <p style={{ fontSize: "20px", fontWeight: "600", textAlign: "center", color: dark ? "white" : "gray", margin: "50px 0" }}>No posts yet.</p>}
                </div>
            </div>
            <div className="blog__postCollection" style={{ marginBottom: "75px" }}>
                <SearchBox setSearch={setSearch} />
                <p style={dark ? { color: "white", backgroundColor: "#15202B" } : {}}><TodayIcon style={dark ? { color: "white" } : {}} />Older Posts</p>
                <div className="blog__posts">
                    {posts?.length ? posts.filter(post => getObjStr(post).toLowerCase().includes(search.toLowerCase().replaceAll(" ", ""))).map((post, index) => <PostCard key={index} post={post} setPost={setPost} setPosts={setPosts} setPostState={setPostState} setComments={setComments} dark={dark} />) : <p style={{ fontSize: "20px", fontWeight: "600", textAlign: "center", color: dark ? "white" : "gray", margin: "50px 0" }}>No posts yet.</p>}
                </div>
            </div>
            <Drawer anchor={"bottom"} open={postState} onClose={() => setPostState(false)}>
                <Post post={post} setPostState={setPostState} comments={comments} setComments={setComments} dark={dark} />
            </Drawer>
            <SpeedDial ariaLabel="SpeedDial basic example" sx={{ position: 'fixed', right: 10, bottom: 10 }} icon={<SpeedDialIcon style={{ color: "white" }} />}>
                {user?.professionalAffiliation === "Student" ? <SpeedDialAction key={"Book an Appointment"} icon={<AssignmentIcon />} tooltipTitle={"Book an Appointment"} onClick={() => history.push(APPOINTMENT_ROUTE)} /> : null}
                {user?.professionalAffiliation === "Counsellor" ? <SpeedDialAction key={"Appointments"} icon={<PeopleAltRoundedIcon />} tooltipTitle={"Appointments"} onClick={() => history.push(APPOINTMENTS_ROUTE)} /> : null}
                {user?.professionalAffiliation === "Counsellor" ? <SpeedDialAction key={"Data"} icon={<BarChartRoundedIcon />} tooltipTitle={"Data"} onClick={() => history.push(DATA_ROUTE)} /> : null}
                {user ? <SpeedDialAction key={"Appointments"} icon={<PeopleAltRoundedIcon />} tooltipTitle={"Appointments"} onClick={() => history.push(APPOINTMENTS_ROUTE)} /> : null}
                {!user ? <SpeedDialAction key={"Sign In"} icon={<VpnKeyRoundedIcon />} tooltipTitle={"Sign In"} onClick={() => history.push(SIGN_IN_ROUTE)} /> : null}
                {!user ? <SpeedDialAction key={"Sign Up"} icon={<PersonAddRoundedIcon />} tooltipTitle={"Sign Up"} onClick={() => history.push(SIGN_UP_ROUTE)} /> : null}
                {user ? <SpeedDialAction key={"Sign Out"} icon={<ExitToAppRoundedIcon />} tooltipTitle={"Sign Out"} onClick={() => handleSignOut()} /> : null}
                <SpeedDialAction key={dark ? "Light mode" : "Dark mode"} icon={dark ? <Brightness4RoundedIcon /> : <DarkModeRoundedIcon />} tooltipTitle={dark ? "Light mode" : "Dark mode"} onClick={() => handleDarkMode()} />
            </SpeedDial>
        </div>
    );
};

export default Blog;
