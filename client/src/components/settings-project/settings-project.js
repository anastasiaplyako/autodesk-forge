import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from "../../context/auth.context";
import './settings-project.scss';
import {Menu} from "../menu/menu";

export const SettingsProject = (props) => {
    const [project, setProject] = useState({});
    const auth = useContext(AuthContext);
    const [isUpdate, setIsUpdate] = useState({
        email: false,
        number: false
    });
    const [value, setValue] = useState('');

    const getProject = () => {
        fetch(`/api/forge/info?id=${auth.idProject}`, {
            headers: {
                'Authorization': `Bearer ${auth.token}`
            }
        }).then(res => res.json()).then(res => {
            console.log(res);
            setProject(res.project);
        })
    }

    useEffect(() => {
        getProject();
        console.log(project);
    }, [isUpdate]);

    const fetchObject = (project) => {
        fetch('/api/forge/info/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            },
            body: JSON.stringify({
                project: project,
            })
        }).then((res) => {
            if (res.ok) {
                setValue('');
                setProject(project);
            }
        })
    }

    const changeHandler = (type) => {
        switch (type) {
            case ("email"): {
                setIsUpdate({...isUpdate, email: !isUpdate.email});
                if (isUpdate.email) {
                    setProject({...project, email: value});
                    fetchObject({...project, email: value});
                }
                break;
            }
            case("number"): {
                setIsUpdate({...isUpdate, number: !isUpdate.number});
                if (isUpdate.number) {
                    setProject({...project, number: value})
                    fetchObject({...project, number: value});
                }
                break;
            }
            default: {
                break;
            }
        }
    }

    const inputHandler = (event) => {
        setValue(event.target.value)
    }

    return (
        <div className="settings">
            <Menu />
            <div className="settings__item">
                {isUpdate.email ? <input
                        onChange={inputHandler}
                        value={value}/>
                    : <span>Email администратора: {project.email}</span>}
                <a onClick={() => changeHandler("email")}>
                    {isUpdate.email ? "Сохранить" : "Изменить"}
                </a>
            </div>
            <div className="settings__item">
                {isUpdate.number ? <input
                        onChange={inputHandler}
                        value={value}/>
                    : <span>Регистрационный номер: {project.number}</span>}
                <a onClick={() => changeHandler("number")}>
                    {isUpdate.number ? "Сохранить" : "Изменить"}
                </a>
            </div>
        </div>
    )
}