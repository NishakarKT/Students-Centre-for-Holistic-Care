import React, { useState, useEffect } from "react";
import "./ImgList.css";
// storage
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "../../../config/firebase";
// material-ui
import { ImageList, ImageListItem } from "@mui/material";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";

const ImgList = ({ dark }) => {
    const [images, setImages] = useState([]);

    const srcset = (image, size, rows = 1, cols = 1) => {
        return {
            src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
            srcSet: `${image}?w=${size * cols}&h=${size * rows
                }&fit=crop&auto=format&dpr=2 2x`,
        };
    };

    useEffect(() => {
        if (images.length === 0) {
            listAll(ref(storage, 'images'))
                .then(res => {
                    res.items.map(item => {
                        getDownloadURL(ref(storage, item._location.path_))
                            .then(url => setImages(images => [...images, url]))
                            .catch((error) => { });
                        return item;
                    });
                }).catch((error) => { });
        }
    }, [images.length]);

    return (
        images.length ? <div className="imgList">
            <p className="imgList__title" style={dark ? { color: "white", backgroundColor: "#15202B" } : {}}><ImageRoundedIcon style={dark ? { color: "white" } : {}} />Image Gallery</p>
            <ImageList sx={{ width: "100%", height: 450, backgroundColor: dark ? "#192734" : "white" }} variant="quilted" cols={4} rowHeight={121}>
                {images.map((image, index) =>
                    <ImageListItem key={image} cols={index % 3 || 1} rows={index % 3 || 1}>
                        <img {...srcset(image, 121, index % 3, index % 3)} alt={""} loading="lazy" />
                    </ImageListItem>)}
            </ImageList>
        </div> : <></>
    );
};

export default ImgList;
