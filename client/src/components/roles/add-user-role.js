import React, {useContext, useState} from 'react';
import {AuthContext} from "../../context/auth.context";

export const AddUserRole = (props) => {
    const auth = useContext(AuthContext);
    const token = auth.token;
    const [login, setLogin] = useState('');
    const [value, setValue] = useState({});

    const changeHandler = (event) => {
        setLogin(event.target.value);
    }

    const changeOptionSelect = (event) => {
        setValue(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch('/api/forge/role/assignRole', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                idRole: JSON.parse(value)._id,
                login: login,
                idProject: JSON.parse(value).idProject,
            })
        }).then(() => {
            alert("Create!");
        })
    }

    return (
        <div className="roles__add">
            <form onSubmit={handleSubmit}>
            <span>Пригласить пользователя</span>
            <input type="text" onChange={changeHandler} />
            <select value={value} onChange={changeOptionSelect}>
                {props.roles && props.roles.map(role => {
                    return(
                        <option key={role._id} value={JSON.stringify(role)}>{role.nameRole}</option>
                    )
                })}
            </select>
            <input type="submit" value="Отправить" />
            </form>
        </div>
    )
}