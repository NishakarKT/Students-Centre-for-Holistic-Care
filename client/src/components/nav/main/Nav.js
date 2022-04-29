import React, { useState, useEffect } from "react";
import {useHistory } from "react-router-dom";
import "./Nav.css";
// components
import Dropdown from "../dropdown/Dropdown";
import SideNav from "../sideNav/SideNav";
// constants
import { LOGO_2_PNG } from "../../../constants/images";
import links from "./Links";
// material-ui
import { Drawer } from "@mui/material";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { HOME_ROUTE } from "../../../constants/routes";

const Nav = ({ dark }) => {
  const history = useHistory();
  const [navState, setNavState] = useState(false);
  const [servicesState, setServicesState] = useState(false);
  const [eventsState, setEventsState] = useState(false);
  const [instaLinksState, setInstaLinksState] = useState(false);
  const [anecdotesState, setAnecdotesState] = useState(false);
  const [sideNavState, setSideNavState] = useState(false);

  const dropdownStates = {
    "Services": {
      state: servicesState,
      setState: setServicesState,
    },
    "Events": {
      state: eventsState,
      setState: setEventsState,
    },
    "Insta-Links": {
      state: instaLinksState,
      setState: setInstaLinksState,
    },
    "Anecdotes": {
      state: anecdotesState,
      setState: setAnecdotesState,
    },
  };

  const scrollHandler = () => {
    if (window.scrollY > 150)
      setNavState(true);
    else
      setNavState(false);
  }

  useEffect(() => {
    window.addEventListener("scroll", scrollHandler)
    return () => {
      window.removeEventListener("scroll", scrollHandler)
    }
  }, []);

  return (
    <nav className="nav" style={{ backgroundColor: navState ? dark ? "#15202B" : "#1d2410" : "transparent" }}>
      <div className="nav__left">
        <img onClick={() => history.push(HOME_ROUTE)} src={LOGO_2_PNG} alt="" />
      </div>
      <div className="nav__right">
        {
          links.map((link, index) =>
            <div className="nav__link" key={index}>
              <p onClick={() => !link.isDropdown ? window.open(link.link) : null} onMouseEnter={() => dropdownStates[link.label]?.setState(true)} onMouseLeave={() => dropdownStates[link.label]?.setState(false)}>{link.label} {link.isDropdown ? <KeyboardArrowDownRoundedIcon /> : null}</p>
              {link.isDropdown ? <Dropdown links={link.links} state={dropdownStates[link.label].state} setState={dropdownStates[link.label].setState} /> : null}
            </div>
          )
        }
      </div>
      <div className="nav__menuBtn">
        <MenuRoundedIcon onClick={() => setSideNavState(true)} />
      </div>
      <Drawer anchor={"right"} open={sideNavState} onClose={() => setSideNavState(false)}>
        <SideNav />
      </Drawer>
    </nav>
  );
};

export default Nav;
