import './App.css';
import React from 'react';
import {useRoutes} from "./route/route";
import {BrowserRouter} from "react-router-dom";
import {useAuth} from "./hooks/auth.hooks";
import {AuthContext} from "./context/auth.context";

function App() {
    const { token, login, logout, userId, addProject, removeProject, urn, role, idProject } = useAuth();
    const isAuth = !!token;
    const routes = useRoutes(isAuth, userId, role);

    return (
        <AuthContext.Provider value={{ token, login, logout, userId, isAuth, addProject, removeProject, urn, role, idProject }}>
            <BrowserRouter>
                {routes}
            </BrowserRouter>
        </AuthContext.Provider>
    );
}

export default App;
