import React from "react";
import "./Comment.css";

const Comment = ({ comment, delay, dark }) => {
    return (
        <div className="comment" style={{ animationDelay: delay + "s", backgroundColor: dark ? "#15202B" : "white" }}>
            <p className="comment__user" style={{ color: dark ? "white" : "teal" }}>{comment.name}</p>
            <p className="comment__professionalAffiliation" style={{ color: dark ? "white" : "grey" }}>{comment.professionalAffiliation}</p>
            <p className="comment__content" style={{ color: dark ? "white" : "black" }}>{comment.content}</p>
            <p className="comment__date" style={{ color: dark ? "white" : "grey" }}>{comment.date}</p>
        </div>
    );
};

export default Comment;
