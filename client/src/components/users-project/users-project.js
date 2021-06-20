import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from "../../context/auth.context";
import './users-project.scss';
import {Menu} from "../menu/menu";
import {CloseCircleOutlined} from '@ant-design/icons';
import {isWidthUp} from "@material-ui/core";

export const UsersProject = () => {
    const auth = useContext(AuthContext);
    const token = auth.token;
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [value, setValue] = useState({});
    const [update, setUpdate] = useState({
        isUpdate: false,
        textButton: "Обновить",
        idUser: '',
    });

    const getUsers = () => {
        fetch(`/api/forge/users/?id=${auth.idProject}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        }).then(res => res.json()).then(res => {
            console.log("res", res);
            setUsers(res);
        })
    }

    const fetchRole = () => {
        fetch(`/api/forge/role?id=${auth.idProject}`, {
            headers: {
                'Authorization': `Bearer ${auth.token}`
            },
        }).then(res => res.json()).then(res => {
            setRoles(res)
        })
    }

    useEffect(() => {
        getUsers();
        fetchRole();
    }, [])

    const changeOptionSelect = (event) => {
        console.log(event.target.value);
        setValue(event.target.value);
    }

    const updateHandler = (user) => {
        console.log(user);
        if (!update.isUpdate) {
            setUpdate({isUpdate: true, textButton: "Сохранить", idUser: user.idUser._id});
            setValue(JSON.stringify(user.idRole));
        } else {
            //fetch
            console.log("JSON.parse(value)._id", JSON.parse(value)._id);
            fetch('/api/forge/users/updateRole', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                },
                body: JSON.stringify({
                    idUserRole: user._id,
                    idRole: JSON.parse(value)._id
                })
            }).then(res => {
                if (res.ok) {
                    setUsers(users.map(item => item._id === user._id
                        ? {...user, idRole: JSON.parse(value)}
                        : item))
                    setUpdate({isUpdate: false, textButton: "Обновить", idUser: ''});
                } else {
                    alert("error!");
                }
            })
            console.log(value);
        }
    }

    const deleteUserFromProject = (deleteUser) => {
        console.log(deleteUser);
        fetch(`/api/forge/users/delete?id=${deleteUser._id}`, {
            headers: {
                'Authorization': `Bearer ${auth.token}`
            },
        }).then(res => res.json()).then(res => {
            setUsers(users.filter(user => user._id !== deleteUser._id))
        })
    }

    return (
        <>
            <Menu/>
            <div className="user">
                {users && users.map(user => {
                    return (
                        <div className="user__card">
                            <div className="user__card_login">
                                <span>{user.idUser.login}</span>
                            </div>
                            <div className="user__card_role">
                                {user.idUser._id !== update.idUser &&
                                <span>{user.idRole.nameRole}</span>}
                                {update.isUpdate && user.idUser._id === update.idUser &&
                                <select value={value} onChange={changeOptionSelect}>
                                    {roles && roles.map(role => {
                                        return (
                                            <option
                                                key={role._id}
                                                value={JSON.stringify(role)}>
                                                {role.nameRole}
                                            </option>
                                        )
                                    })}
                                </select>}
                            </div>
                            <div className="user__card_operation">
                                {update.isUpdate && user.idUser._id === update.idUser &&
                                <a onClick={() => updateHandler(user)}>{update.textButton}</a>
                                }
                                {user.idUser._id !== update.idUser &&
                                <a onClick={() => updateHandler(user)}>Обновить</a>
                                }
                                <CloseCircleOutlined onClick={() => deleteUserFromProject(user)}/>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    )
}