import React, { useContext } from "react";
import "./Comments.css";
// components
import Comment from "../comment/Comment";
import CommentInput from "../commentInput/CommentInput";
// contexts
import UserContext from "../../../contexts/User";

const Comments = ({ postId, email, comments, setComments, dark }) => {
    const { user } = useContext(UserContext);
    return (
        <div className="comments">
            {user?.professionalAffiliation === "Counsellor" ? <CommentInput email={email} postId={postId} setComments={setComments} dark={dark} /> : null}
            {comments?.length ? <p className="comments__discussion" style={{ color: dark ? "white" : "teal" }}>what we think...</p> : null}
            {comments?.map((comment, index) => <Comment key={index} comment={comment} delay={index < 3 ? 0.2 * index : 0.6} dark={dark} />)}
        </div>
    );
};

export default Comments;
