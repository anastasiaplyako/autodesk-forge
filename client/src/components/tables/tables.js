import React, {useContext, useEffect, useState} from 'react';
import {CreateTable} from "./create-table";
import {AuthContext} from "../../context/auth.context";
import {NavLink} from "react-router-dom";
import {Menu} from "../menu/menu";

export const Tables = () => {
    const [tables, setTables] = useState([]);
    const auth = useContext(AuthContext);

    const fetchTables = () => {
        fetch(`/api/forge/table/getTables?id=${auth.urn}`, {
            headers: {
                'Authorization': `Bearer ${auth.token}`
            },
        })
            .then(res => res.json())
            .then(res => {
                setTables(res);
            })
    }

    useEffect(() => {
        fetchTables()
    }, []);

    return (
        <>
            <Menu/>
            <div className="tables">
                <CreateTable url='/api/forge/table/createTables'/>
            </div>
            <div className="tables">
                <span>Загруженные таблицы:</span>
                {tables && tables.map(table => {
                    return(
                        <NavLink to={`/table/${table._id}`}>
                            {table.originalName}
                        </NavLink>
                    )
                })}
            </div>
        </>
    )
}