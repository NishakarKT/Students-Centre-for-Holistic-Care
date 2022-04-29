import React, { useState, useContext, useRef } from "react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import "./PostCard.css";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "../../../config/firebase";
// contexts
import UserContext from "../../../contexts/User";
// constants
import { DELETE_POST_ENDPOINT, VIEWED_ENDPOINT } from "../../../constants/endpoints";
// constants
import Loader from "../../../components/loader/Loader";
// material-ui
import { Button, IconButton } from "@mui/material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import RemoveRedEyeRoundedIcon from "@mui/icons-material/RemoveRedEyeRounded";
// funcs
const truncate = (str, len, suffix) => str.substring(0, len) + suffix;

const PostCard = ({ post, setPost, setPosts, setPostState, setComments, fullWidth, dark }) => {
    const reCaptchaRef = useRef();
    const { user } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [views, setViews] = useState(post.views);
    const [verified, setVerified] = useState(false);
    const [reCaptchaState, setReCaptchaState] = useState(false);

    const handleReCaptcha = async token => {
        setVerified(true);
        setReCaptchaState(false);
        deletePost(true);

        // fetch("https://www.google.com/recaptcha/api/siteverify", {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         secret: "6Lcc2w0fAAAAAAO4txrx8wHnnsLVubQaDvWQS1Ag",
        //         response: token
        //     }),
        // })
        // .then(res => console.log(res))
        // .catch(err => console.log(err))
        
        // axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=6Lcc2w0fAAAAAAO4txrx8wHnnsLVubQaDvWQS1Ag&response=${token}`, {}, { headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" } })
        //     .then(res => console.log(res))
        //     .catch(err => console.log(err));
    };

    const deletePost = verified => {
        if (verified) {
            const areYouSure = window.confirm("Are you sure you widh to delete this post? You shall not be able to recover a deleted post.");
            if (areYouSure) {
                try {
                    setLoading(true);
                    if (post.fileRef)
                        deleteObject(ref(storage, post.fileRef)).then(() => {
                        }).catch((error) => {
                        });

                    axios.patch(DELETE_POST_ENDPOINT + "/" + post._id, {})
                        .then(res => {
                            setPosts(posts => posts.filter(p => p._id !== post._id));
                            setVerified(false);
                            setLoading(false);
                        })
                        .catch(err => { setLoading(false); })
                } catch (err) { console.log(err); setLoading(false); setVerified(false); }
            }
        }
        else {
            setReCaptchaState(true);
        }
    };

    const viewedPost = () => {
        setViews(views => views + 1);
        try {
            axios.patch(VIEWED_ENDPOINT + "/" + post._id + "&" + views, {})
                .then(res => { })
                .catch(err => { })
        } catch (err) { }
    };

    const handlePostClick = () => {
        setPost(post);
        setComments(post.comments);
        setPostState(true);
        viewedPost();
    };

    return (
        <div className="postCard" style={{ width: fullWidth ? "100%" : "300px", minHeight: fullWidth ? "200px" : "250px", backgroundColor: dark ? "#15202B" : "white" }} >
            {loading ? <Loader /> : null}
            {reCaptchaState ? <div onClick={() => setReCaptchaState(false)} style={{ position: "fixed", top: 0, left: 0, backgroundColor: "rgba(0,0,0,0.8)", display: "grid", width: "100vw", height: "100vh", placeItems: "center", zIndex: 10000000 }}><ReCAPTCHA sitekey="6Lcc2w0fAAAAAORgyfFLqImaPBK44FfPaBINRgXH" ref={reCaptchaRef} onChange={token => handleReCaptcha(token)} /></div> : null
            }
            {user?.professionalAffiliation === "Counsellor" ? <IconButton onClick={() => deletePost()} style={{ backgroundColor: dark ? "lightcoral" : "red" }}><DeleteRoundedIcon /></IconButton> : null}
            <p className="postCard__date">{post.date}</p>
            <p className="postCard__title" style={{ color: dark ? "white" : "#1976d2" }}>{post.title}</p>
            <p className="postCard__name">{post.name ? "from " + post.name : "from Anonymous"}</p>
            <p className="postCard__content" style={{ color: dark ? "white" : "black" }}>{!fullWidth ? truncate(post.content, 150, "...") : post.content}</p>
            <Button onClick={() => handlePostClick()}>View</Button>
            <p className="postCard__viewsCount"><RemoveRedEyeRoundedIcon />{post.views} {post.views === 1 ? "view" : "views"}</p>
        </div>
    );
};

export default PostCard;
