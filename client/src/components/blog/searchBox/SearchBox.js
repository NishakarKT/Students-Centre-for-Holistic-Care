import React from "react";
import "./SearchBox.css";
// material-ui
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

const SearchBox = ({ setSearch }) => {
    return (
        <div className="searchBox">
            <input className="searchBox__input" type="text" name="" placeholder="Search" onChange={e => setSearch(e.target.value)} />
            <SearchRoundedIcon />
        </div>
    );
};

export default SearchBox;
