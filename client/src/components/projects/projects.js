import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from "../../context/auth.context";
import { useHistory } from "react-router-dom";
import {PrimitiveProject} from "./primitive-project";
import './project.scss';
import {PlusOutlined} from "@ant-design/icons";
import {AddProject} from "./add-project";

export const Projects = (props) => {
    const history = useHistory();
    const auth = useContext(AuthContext);
    const [projects, setProjects] = useState([]);
    const [role, setRole] = useState([]);
    const [openDownload, setOpenDownload] = useState(false);
    const [textButton, setTextButton] = useState('Добавить новый проект');

    useEffect(() => {
        fetch(`/api/forge/oss/buckets?id=${props.idBucket}`, {
            headers: {
                'Authorization': `Bearer ${auth.token}`
            }
        })
            .then(res => res.json())
            .then(res => {
                setProjects(res)
            })
            .then(() => {
                 fetch(`/api/forge/role/own?id=${projects.id}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.token}`
                    }
                }).then(res => res.json()).then(res => {
                         setRole(res);
                     })
            })

    }, [])

    const openDownloadProject = () => {
        setOpenDownload(!openDownload);
        if (openDownload) {
            setTextButton('Добавить новый проект');
        } else {
            setTextButton('Скрыть загрузчик')
        }
    }

    return (
        <>
            <div className="projects__header">
                <h4>Доступные проекты</h4>
                <button onClick={openDownloadProject}>
                    {textButton}
                    <PlusOutlined />
                </button>
            </div>
            <div className="projects__download">
                {openDownload && <AddProject idBucket={props.idBucket}/>}
            </div>
            <div className="projects">
                {projects && role && projects.map(project => {
                    return (<PrimitiveProject
                        project={project}
                    />)
                })}
            </div>
        </>
    )
}
