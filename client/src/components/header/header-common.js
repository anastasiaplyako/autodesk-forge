import React, {useContext} from 'react';
import './header.scss'
import {AuthContext} from "../../context/auth.context";
import {HeaderExpert} from "./header-expert";
import {HeaderMain} from "./header-main";

export const HeaderCommon = () => {
    const auth = useContext(AuthContext);

    const project = () => {
        switch (auth.role) {
            case "expert":
                return <HeaderExpert/>;
            default:
                return <HeaderMain/>;
        }
    }

    return (
        <>{ project() }</>
    )
}