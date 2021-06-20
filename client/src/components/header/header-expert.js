import React, {useContext} from 'react';
import './header.scss'
import {AuthContext} from "../../context/auth.context";

export const HeaderExpert = () => {
    const auth = useContext(AuthContext);

    return (
        <div className="header">
            <a href="/"><i className="fas fa-home"/></a>
            <div className="header_main">
                <a href="/folders">Документация
                </a>
                <a href="/model">Модель</a>
                <a href="/notes">Замечания</a>
                <a href="/" onClick={auth.logout}> Выйти </a>
            </div>
        </div>
    )
}