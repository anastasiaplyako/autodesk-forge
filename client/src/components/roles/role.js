import React, {useContext, useEffect, useState} from 'react';
import {CreateRole} from "./create-role";
import {AuthContext} from "../../context/auth.context";
import {AddUserRole} from "./add-user-role";
import './roles.scss';
import {Menu} from "../menu/menu";
import {CloseCircleOutlined} from '@ant-design/icons';

export const Roles = () => {
    const auth = useContext(AuthContext);
    const token = auth.token;
    const [roles, setRoles] = useState([]);

    const getRoles = () => {
        fetch(`/api/forge/role?id=${auth.idProject}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(res => res.json())
            .then(res => {
                console.log(res);
                setRoles(res);
            })
    }

    useEffect(() => {
        getRoles();
    }, [])

    const fetchDelete = (idRole) => {
        console.log(idRole);
        fetch(`/api/forge/role/delete?id=${idRole}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(res => {
                if (res.ok) {
                    setRoles(roles.filter(role => role._id !== idRole));
                } else {
                    alert("Error!");
                }
            })
    }

    return (
        <>
            <Menu />
            <div className="roles">
                <h4>Назначение ролей</h4>
                <div className="roles__create">
                    <span>Создать роль</span>
                    <CreateRole/>
                </div>
                <AddUserRole roles={roles}/>
                <div className="current__roles">
                    <span>Имеющиеся роли</span>
                    {roles && roles.map(role => {
                        return (
                            <div className="current__roles_item" key={role._id}>
                                {role.nameRole}
                                <CloseCircleOutlined onClick={() => {fetchDelete(role._id)}}/>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}