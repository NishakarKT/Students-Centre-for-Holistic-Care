import React, { useState, useContext } from "react";
import axios from "axios";
import ReactPlayer from "react-player";
import "./NewPost.css";
// storage
import { ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../../config/firebase";
// constants
import { ADD_POST_ENDPOINT } from "../../../constants/endpoints";
// contexts
import UserContext from "../../../contexts/User";
// components
import Loader from "../../../components/loader/Loader";
// material-ui
import { TextareaAutosize, TextField, Button } from "@mui/material";
import ContactSupportRoundedIcon from "@mui/icons-material/ContactSupportRounded";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";

const NewPost = ({ setPosts, dark }) => {
    const { user } = useContext(UserContext);
    const [name, setName] = useState(user?.name || "");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [imgURL, setImgURL] = useState("");
    const [videoURL, setVideoURL] = useState("");
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);

    const handleNewPost = e => {
        e.preventDefault();

        try {
            setLoading(true);
            const date = new Date().toString().substring(0, 15);
            const postData = { name, email: user?.email, title, content, date, views: 0, comments: [], fileRef: imgURL || videoURL ? (imgURL ? "images/" : "videos/") + date + "_" + file.name : "" };

            axios.post(ADD_POST_ENDPOINT, postData)
                .then(res => {
                    // file upload
                    if (imgURL || videoURL)
                        uploadFile(date, file, imgURL ? "images" : "videos");
                    else {
                        setPosts(posts => ([{ ...postData, _id: res.data._id }, ...posts]));
                        setLoading(false);
                    }
                })
                .catch(err => { setLoading(false); })
        } catch (err) { setLoading(false); }

    };

    const updateFile = (file, dir) => {
        if (file) {
            setFile(f => {
                if (f) window.scrollTo(0, window.innerHeight - 100)
                return file;
            });
            if (dir === "images") {
                setImgURL(URL.createObjectURL(file))
                setVideoURL("");
            }
            else if (dir === "videos") {
                setVideoURL(URL.createObjectURL(file))
                setImgURL("");
            }
        }
        else {
            setFile(null);
            if (dir === "images") setImgURL("")
            else if (dir === "videos") setVideoURL("")
        }
    };

    const uploadFile = (date, file, dir) => {
        if (file) {
            const uploadTask = uploadBytesResumable(ref(storage, dir + "/" + date + "_" + file.name), file);

            uploadTask.on("state_changed",
                snapshot => setProgress(Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100)),
                () => { setLoading(false); },
                () => {
                    setLoading(false);
                    window.location.reload();
                });
        }
        else
            setLoading(false);
    }

    return user?.name ?
        <form className="newPost" onSubmit={e => handleNewPost(e)}>
            {loading ? <Loader progress={progress} /> : null}
            <p className="newPost__title" style={dark ? { color: "white", backgroundColor: "#15202B" } : {}}><ContactSupportRoundedIcon style={dark ? { color: "white" } : {}} />What's on your mind?</p>
            {videoURL ? <ReactPlayer url={videoURL} controls={true} width="100%" muted={false} style={{ margin: "10px 0" }} /> : null}
            {imgURL ? <img src={imgURL} alt="" /> : null}
            <TextField variant="standard" label="Enter your name" value={name} onChange={e => setName(e.target.value)} inputProps={{ maxLength: 25 }} className={dark ? "newPost__darkTF" : ""}
            />
            <TextField variant="standard" label="Enter post's title" value={title} onChange={e => setTitle(e.target.value)} inputProps={{ maxLength: 25 }} className={dark ? "newPost__darkTF" : ""} />
            <TextareaAutosize aria-label="minimum height" placeholder="What's on your mind?" value={content} onChange={e => setContent(e.target.value)} className={dark ? "newPost__darkTA" : ""} />
            <div className="newPost__options">
                <CameraAltRoundedIcon style={{ paddingRight: "5px", border: dark ? "2px solid white" : "none" }} onClick={e => e.currentTarget.nextElementSibling.click()} />
                <input type="file" accept="image/*" onChange={e => updateFile(e.target.files[0], "images")} />
                <VideocamRoundedIcon style={{ paddingLeft: "5px", border: dark ? "2px solid white" : "none" }} onClick={e => e.currentTarget.nextElementSibling.click()} />
                <input type="file" accept="video/*" onChange={e => updateFile(e.target.files[0], "videos")} />
                <Button type="submit" disabled={!(content && title)} style={!(content && title) ? { backgroundColor: "lightgrey" } : {}}>Post</Button>
            </div>
        </form> : <></>
};

export default NewPost;
