import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Appointment, Post, User } from "./models.js";


const Router = express.Router();
const SECRET_KEY = "ZbLhfB[rBK2$\.,An<&+(y&yM2Kc.#L?RkVx#TC5";
const ACCESS_KEY = "789";

Router.get("/get_appointments", async (req, res) => {
    Appointment.find({}, async (err, data) => {
        if (err)
            res.status(500).send(err);
        else
            res.status(200).send(data.reverse());
    });
});

Router.post("/book_appointment", async (req, res) => {
    const appointmentData = req.body;

    try {
        const appointment = new Appointment(appointmentData);
        appointment.save()
            .then(() => res.status(201).send())
            .catch(() => res.status(400).send())
    } catch (err) { res.status(500).send() };
});

Router.patch("/update_appointment", async (req, res) => {
    const { _id, status } = req.body;

    try {
        Appointment.find({ _id }, async (err, data) => {
            if (err)
                res.status(500).send();
            else {
                Appointment.updateOne({ _id }, { $unset: { firstName: "", lastName: "", rollNum: "", email: "", status: "" } }).then(res => {
                    res.status(200).send();
                }).catch(err => res.send())
            }
        });
    } catch (err) { res.status(500).send() };
});

Router.post("/auth", async (req, res) => {
    const { email, password } = req.body;

    try {
        const token = await jwt.sign({ email }, SECRET_KEY);

        User.find({ email }, async (err, data) => {
            if (err)
                res.status(502).send({ errMsg: "Sorry, the login failed. PLease, try again after sometime." });
            else {
                if (data.length === 0)
                    res.status(404).send({ errMsg: "The requested account doesn't exist." });
                else {
                    const hashedPass = data[0].password;
                    const match = await bcrypt.compare(password, hashedPass);
                    if (match)
                        res.status(200).send(token);
                    else
                        res.status(401).send({ errMsg: "Password doesn't match! Try another one." });
                }
            }
        });
    } catch (err) { res.status(500).send({ errMsg: "Sorry, the login failed. PLease, try again after sometime." }) };

});

Router.patch("/reset", async (req, res) => {
    const { email, pass } = req.body;

    try {
        const hashedPass = await bcrypt.hash(pass, 10);
        User.updateOne({ email }, { password: hashedPass }, async (err, data) => {
            if (err)
                res.status(500).send(err);
            else {
                const token = await jwt.sign({ email }, SECRET_KEY);
                res.status(201).send(token);
            }
        });
    } catch (err) { res.status(500).send({ errMsg: "Sorry, the login failed. PLease, try again after sometime." }) };

});

Router.post("/new", async (req, res) => {
    const { name, professionalAffiliation, email, contact, password, accessKey } = req.body;

    if (!accessKey || accessKey === ACCESS_KEY) {
        try {
            const hashedPass = await bcrypt.hash(password, 10);
            const token = await jwt.sign({ email }, SECRET_KEY);
            const user = new User({ name, professionalAffiliation, email, contact, password: hashedPass });
            user.save().then(() => {
                res.status(201).send(token);
            }).catch(err => res.status(403).send({ errMsg: "An account with the provided email already exists." }))
        } catch (err) { res.status(500).send({ errMsg: "Sorry, the account could not be registered. PLease, try again after sometime." }) };
    }
    else
        res.status(401).send({ errMsg: "The access key provided is invalid." });
});

Router.post("/token", async (req, res) => {
    const { token } = req.body;
    try {
        const { email } = await jwt.verify(token, SECRET_KEY);

        User.find({ email }, (err, data) => {
            if (err)
                res.status(502).send({ errMsg: "Database error." });
            else {
                if (data.length === 0)
                    res.status(404).send({ errMsg: "Account doesn't exist." })
                else {
                    const { name, professionalAffiliation, email } = data[0];
                    const user = { name, professionalAffiliation, email };
                    res.status(200).send(user);
                }
            }
        });
    } catch (err) { res.status(500).send({ errMsg: "Server error." }) };

});

Router.patch("/add_comment/:postId", async (req, res) => {
    const commentData = req.body;
    const { postId } = req.params;

    try {
        Post.find({ _id: postId }, async (err, data) => {
            if (err)
                res.status(500).send();
            else {
                const comments = data[0].comments;
                const updatedComments = [...comments, commentData];

                Post.updateOne({ _id: postId }, {
                    comments: updatedComments
                }).then(res => {
                    res.status(200).send();
                }).catch(err => res.send())
            }
        });
    } catch (err) { res.status(500).send() };
});

Router.post("/add_post", async (req, res) => {
    const postData = req.body;
    const post = new Post(postData);

    try {
        post.save().then(response => {
            res.status(201).send({ _id: response._id });
        }).catch(err => console.log(err))
    } catch (err) { console.log(err) };
});

Router.get("/get_posts", async (req, res) => {
    Post.find({}, async (err, data) => {
        if (err)
            res.status(500).send(err);
        else
            res.status(200).send(data.reverse());
    });
});

Router.patch("/delete_post/:postId", async (req, res) => {
    const { postId } = req.params;

    Post.deleteOne({ _id: postId }, async (err, data) => {
        if (err)
            res.status(500).send(err);
        else
            res.status(200).send(data);
    });
});

Router.patch("/viewed/:postId&:views", async (req, res) => {
    const { postId, views } = req.params;

    Post.updateOne({ _id: postId }, { views: Number(views) + 1 }, async (err, data) => {
        if (err)
            res.status(500).send(err);
        else
            res.status(200).send(data);
    });
});

export default Router;