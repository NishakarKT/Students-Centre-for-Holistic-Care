import React from "react";
import "./Dropdown.css";

const Dropdown = ({ links, state, setState }) => {
    return (state ? <div className="dropdown" onMouseEnter={() => setState(true)} onMouseLeave={() => setState(false)}>
        {
            links.map((link, index) => {
                if (link.label)
                    return <p key={index} onClick={() => window.open(link.link)} style={{ animation: `dropdown__itemAppear 0.1s linear ${index * 0.02}s 1 forwards` }}>{link.label}</p>
                else
                    return <img key={index} onClick={() => window.open(link.link)} src={link.logo} alt="" style={{ animation: `dropdown__itemAppear 0.1s linear ${index * 0.02}s 1 forwards` }} />
            })
        }
    </div> : <></>
    );
};

export default Dropdown;
