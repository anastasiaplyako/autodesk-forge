import React, {useContext, useState} from 'react';
import {AuthContext} from "../../context/auth.context";

export const CreateRole = () => {
    const auth = useContext(AuthContext);
    const token = auth.token;
    const [nameRole, setNameRole] = useState([]);

    const changeHandler = (event) => {
        setNameRole(event.target.value);
    }

    const createRole = () => {
        fetch('/api/forge/role/createRole', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                nameRole: nameRole,
                idProject: auth.idProject,
            })
        }).then(() => {
            alert("Create!");
            window.location.reload();
        })
    }

    return(
        <>
        <input type="text" onChange={changeHandler}/>
        <button onClick={createRole}>Создать</button>
        </>
    )
}