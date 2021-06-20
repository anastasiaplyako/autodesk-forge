import React, {useContext, useState} from 'react';
import {AuthContext} from "../../../context/auth.context";
import {PlusOutlined} from "@ant-design/icons";

export const UserBuckets = (props) => {
    const [login, setLogin] = useState('');
    const auth = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState('');

    const changeHandler = (event) => {
        setLogin(event.target.value);
    }

    const fetchHandler = () => {
        fetch('/api/forge/buckets/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            },
            body: JSON.stringify({
                idBucket: props.idBucket,
                login: login,
            })
        }).then(() => {})
    }

    return (
        <div className="assign">
            <button id="btn" onClick={() => {setIsOpen(!isOpen)}}>Пригласить пользователей <PlusOutlined /></button>
            {isOpen && <div className="assign__user">
                <span>Введите логин</span>
                <input type="text" onChange={changeHandler}/>
                <button onClick={fetchHandler}>Отправить</button>
            </div>}
        </div>
    )
}