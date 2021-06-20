import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {AuthContext} from "../../context/auth.context";
import {PrimitiveTable} from "./primitive-table";
import {Menu} from "../menu/menu";

export const Table = () => {
    const auth = useContext(AuthContext);
    const id = useParams().id;
    const [workbooks, setWorkbooks] = useState([]);

    const fetchTable = () => {
        fetch(`/api/forge/table/getTable?id=${id}`, {
            headers: {
                'Authorization': `Bearer ${auth.token}`,
            }
        }).then(res => res.json()).then(res => {
            setWorkbooks(res);
        })
    }

    useEffect(() => {
        fetchTable();
    }, [])

    return (
        <>
            <Menu />
            {workbooks && workbooks.map(workbook => {
                return <PrimitiveTable workbook={workbook} key={Math.random()}/>
            })}
        </>
    )
}