import React from "react";
import "./SideNav.css";
import links from "../main/Links";
// material-ui
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

const SideNav = () => {
    return (
        <div className="sideNav">
            {links.map((link, index) =>
                <div className="sideNav__link" key={index}>
                    <p className="sideNav__linkHead" onClick={() => !link.isDropdown ? window.open(link.link) : null}>{link.label} {link.isDropdown ? <KeyboardArrowDownRoundedIcon /> : null}</p>
                    <div className="sideNav__dropdownLinks">
                        {link.isDropdown
                            ? link.links.map(link => link.label ?
                                <p key={index} onClick={() => window.open(link.link)}> {link.label}</p> :
                                <img key={index} onClick={() => window.open(link.link)} src={link.logo} alt="" />)
                            : null}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SideNav;
