import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from "../../context/auth.context";
import {Menu} from "../menu/menu";
import "./assignRole.scss";

export const FolderRole = () => {
    const auth = useContext(AuthContext);
    const [roles, setRoles] = useState([]);
    const [folders, setFolders] = useState([]);
    const [value, setValue] = useState({});
    const [checkedFolder, setCheckedFolder] = useState({});

    const fetchRole = () => {
        fetch(`/api/forge/role?id=${auth.idProject}`, {
            headers: {
                'Authorization': `Bearer ${auth.token}`
            },
        }).then(res => res.json()).then(res => {
            setRoles(res)
        })
    }

    const fetchFolder = () => {
        fetch(`/api/forge/folders/all?id=${auth.urn}`, {
            headers: {
                'Authorization': `Bearer ${auth.token}`
            },
        }).then(res => res.json()).then(res => {
            setFolders(res)
        })
    }

    const clickHandler = () => {
        const idFolders = [];
        for (const [key, value] of Object.entries(checkedFolder)) {
            if (value) {
                idFolders.push(JSON.parse(key)._id);
            }
        }
        console.log(JSON.parse(value), JSON.parse(value)._id)

        fetch('/api/forge/folders/assignFolder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            },
            body: JSON.stringify({
                idFolders: idFolders,
                idRole: JSON.parse(value)._id
            })
        }).then(() => {
            alert("Create!");
        })
    }

    useEffect(() => {
        fetchRole();
        fetchFolder();
    }, [checkedFolder])

    const changeOptionSelect = (event) => {
        setValue(event.target.value);
    }

    const handleChangeChecked = (event) => {
        setCheckedFolder({...checkedFolder, [event.target.name]: event.target.checked});
    }

    return (
        <>
            <Menu/>
            <div className="assignRole">
                <select value={value} onChange={changeOptionSelect}>
                    {roles && roles.map(role => {
                        return (
                            <option key={role._id} value={JSON.stringify(role)}>{role.nameRole}</option>
                        )
                    })}
                </select>
                {folders && folders.map(folder => {
                    return (
                        <div className="folders">
                            <input
                                key={folder._id}
                                type="checkbox"
                                name={JSON.stringify(folder)}
                                checked={checkedFolder[folder.name]}
                                onChange={handleChangeChecked}/>
                            <span>{folder.nameFolder}</span>
                        </div>)
                })}
                <button onClick={clickHandler}>Отправить</button>
            </div>
        </>
    )
}