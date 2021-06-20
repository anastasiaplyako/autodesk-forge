import React, {useContext, useEffect, useState} from 'react'
import {AuthContext} from "../../context/auth.context";
import {useHistory} from "react-router-dom";

export const PrimitiveProject = (props) => {
    const history = useHistory();
    const project = props.project;
    const auth = useContext(AuthContext);
    const [role, setRole] = useState([]);

    const downloadProject = (project, role) => {
        auth.removeProject();
        auth.addProject(project, role);
        history.push('/folders')
    }

    useEffect(() => {
            fetch(`/api/forge/role/own?id=${project.id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.token}`
                }
            })
                .then(res => res.json())
                .then(res => {
                    setRole(res[0]);
                })
        }
        , [])

    return (
        <div className="projects_card">
            <div className="projects_card__start">
                <img src={''}/>
            </div>
            <div className="projects_card__end">
                <span>{project.text}</span>
                <button onClick={() => downloadProject(project.id, role)}>Загрузить</button>
            </div>
        </div>
    )
}
