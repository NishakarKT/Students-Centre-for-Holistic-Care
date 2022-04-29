import React, { useEffect, useState } from "react";
import ReactPlayer from 'react-player'
import "./Post.css";
// storage
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../../config/firebase";
// material-ui
import { IconButton } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import RemoveRedEyeRoundedIcon from "@mui/icons-material/RemoveRedEyeRounded";
// constants
import { BLOG_MAIN_JPG } from "../../../constants/images";
// components
import Comments from "../comments/Comments";
import Loader from "../../loader/Loader";

const Post = ({ post, setPostState, comments, setComments, dark }) => {
    const [imgURL, setImgURL] = useState("");
    const [videoURL, setVideoURL] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleScrollEvents = () => {
            const post = document.querySelector(".post__container");
            const scrollToTopBtn = document.querySelector(".post__scrollToTopBtn");
            scrollToTopBtn.style.transform = post.scrollTop > 10 ? "scale(1)" : "scale(0)";
        };

        const post = document.querySelector(".post__container");
        post.addEventListener("scroll", handleScrollEvents)
        return () => document.removeEventListener("scroll", handleScrollEvents)
    }, [])

    useEffect(() => {
        getFileRef(post.fileRef);
    }, [post])

    const scrollToTop = () => {
        const post = document.querySelector(".post__container");
        post.scrollTo(0, 0);
    };

    const getFileRef = (fileRef) => {
        setLoading(true);
        getDownloadURL(ref(storage, fileRef))
            .then((url) => {
                if (fileRef.split("/")[0] === "images") {
                    setVideoURL("");
                    setImgURL(url);
                    setLoading(false);
                }
                else if (fileRef.split("/")[0] === "videos") {
                    setImgURL("");
                    setVideoURL(url);
                    setLoading(false);
                }
            })
            .catch(() => setLoading(false))
    }

    return (
        <div className="post" style={dark ? { backgroundColor: "#192734" } : {}}>
            {loading ? <Loader /> : null}
            <IconButton onClick={() => scrollToTop()} className="post__scrollToTopBtn" style={{ position: "fixed", bottom: "10px", right: "10px", color: "white", backgroundColor: "green", border: "2px solid white" }}><ArrowUpwardRoundedIcon style={{ fontSize: "30px" }} /></IconButton>
            <IconButton onClick={() => setPostState(false)} style={{ position: "fixed", top: "10px", right: "10px", color: "red", backgroundColor: "white" }}><CloseRoundedIcon style={{ fontSize: "30px" }} /></IconButton>
            <img src={imgURL ? imgURL : BLOG_MAIN_JPG} alt="" className="post__photo" />
            <div className="post__container" >
                <div className="post__main">
                    <p className="post__date">{post.date}</p>
                    <p className="post__title" style={{ color: dark ? "white" : "teal" }}>{post.title}</p>
                    <p className="post__name">{post.name ? "from " + post.name : "from Anonymous"}</p>
                    {imgURL ? <img className="post__image" src={imgURL} alt="" style={{ marginBottom: "20px" }} /> : null}
                    {videoURL ? <ReactPlayer url={videoURL} controls={true} width="100%" muted={false} style={{ marginBottom: "20px" }} /> : null}
                    <p className="post__content" style={{ color: dark ? "white" : "black" }}>{post.content}</p>
                </div>
                <p className="post__viewsCount"><RemoveRedEyeRoundedIcon />{post.views} {post.views === 1 ? "view" : "views"}</p>
                <Comments postId={post._id} email={post.email} comments={comments} setComments={setComments} dark={dark} />
            </div>
        </div>
    );
};

export default Post;
