import './folder.scss'
import React, {useContext, useState} from 'react';
import {NavLink} from "react-router-dom";
import {AuthContext} from "../../context/auth.context";
import config from "../../config.json";
import {CloseOutlined} from "@ant-design/icons";

export const Folder = (props) => {
    const auth = useContext(AuthContext);
    const [notes, setNotes] = useState('');
    const [status, setStatus] = useState();
    const isAdmin = auth.role === config.admin;
    const isExpert = auth.role === config.expert;

    const changeHandler = (event) => {
        setNotes(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch('/api/forge/notes/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            },
            body: JSON.stringify({
                notes: notes,
                status: status,
                idFolder: props.folder._id
            })
        }).then(() => {
            alert('ok!');
            setNotes('');
        });
    }

    const deleteFolder = idFolder => {
        fetch(`/api/forge/folders/delete?id=${idFolder}`, {
            headers: {
                'Authorization': `Bearer ${auth.token}`,
            }
        })
            .then(res => {
                console.log(res);
                if (res.ok) {
                    window.location.reload();
                } else {
                    alert("error!");
                }
            })
    }

    return (
        <div className="folder">
            {isAdmin && <CloseOutlined onClick={() => {
                deleteFolder(props.folder._id)
            }}/>}
            <NavLink to={`/folder/${props.folder._id}`}>
                <img src="https://img.icons8.com/color/96/000000/folder-invoices--v1.png"/>
                <span>{props.folder.nameFolder}</span>
            </NavLink>
            {isExpert && <form onSubmit={handleSubmit}>
                <span>Написать замечание:</span>
                <input
                    type="text"
                    value={notes}
                    onChange={changeHandler}/>
                <button type="submit">Отправить</button>
            </form>}
        </div>
    )
}