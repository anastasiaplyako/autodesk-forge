import React, {useContext, useEffect, useState} from 'react';
import {useHttp, } from "../../hooks/http.hooks";
import {useMessage} from "../../hooks/message.hook";
import {AuthContext} from "../../context/auth.context";
import './auth.scss';

export const Auth = () => {
    const auth = useContext(AuthContext);
    const message = useMessage();
    const {loading, request, error, clearError} = useHttp();
    const [form, setForm] = useState({
        login: "", password: ""
    })

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError])

    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})
    }

    const loginHandler = async () => {
        try {
            console.log("form = ", form);
            const dataLogin = await fetch('/api/forge/auth/login', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            })
            const loginJson = await dataLogin.json();
            auth.login(loginJson.token, loginJson.userId);
        } catch (e) {
        }
    }

    const registerHandler = async () => {
        try {
            fetch('/api/forge/auth/register', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            })
                .then(res => res.json())
                .then(res => {

                })
        } catch (e) {
            console.log("e =", e);
        }
    }

    return (
        <div className="container">
            <div className="first">
                <div className="first__auth ">
                    <div className="first__auth__input">
                        <input
                            className="input"
                            type='text'
                            id="login"
                            name="login"
                            onChange={changeHandler}
                            placeholder="Login"
                        />
                        <input
                            id="password"
                            className="input"
                            name="password"
                            type='text'
                            onChange={changeHandler}
                            placeholder="Password"
                        />
                    </div>

                    <div className="first__auth__operations">
                        <button
                            className="first__auth__operations_login"
                            onClick={loginHandler}
                            disabled={loading}
                        >
                            Войти
                        </button>
                        <button
                            className="first__auth__operations_register"
                            onClick={registerHandler}
                            disabled={loading}
                        >
                            Регистрация
                        </button>
                    </div>

                </div>
            </div>
        </div>
            )
}