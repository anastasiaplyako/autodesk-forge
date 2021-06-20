import React, {useContext} from 'react';
import {AuthContext} from "../../context/auth.context";

export const HeaderMain = () => {
    const auth = useContext(AuthContext);

    return (
        <div className="header">
            <a href="/"><i className="fas fa-home"/></a>
            <div className="header_main">
                <a href="/folders">Документация</a>
                <a href="/model">Модель</a>
                <a href="/" onClick={auth.logout}> Выйти </a>
            </div>
        </div>
    )
}