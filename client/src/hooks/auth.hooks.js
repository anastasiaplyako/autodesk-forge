import {useState, useCallback, useEffect} from 'react';
const config = require("../config.json");
const storageName = config.storageName;
const storageProject = config.storageProject;

export const useAuth = () => {
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [ready, setReady] = useState(false);
    const [urn, setUrn] = useState('');
    const [role, setRole] = useState('');
    const [idProject, setIdProject] = useState('');

    const login = useCallback((jwtToken , id) => {
        setToken(jwtToken);
        setUserId(id);
        localStorage.setItem(storageName, JSON.stringify({
            userId: id, token: jwtToken, }));
    }, [])

    const logout = useCallback(() => {
        setToken(null);
        setUserId(null);
        localStorage.removeItem(storageName);
    }, [])

    const addProject = useCallback((urn, role) => {
        setUrn(urn);
        console.log("addProject", urn, role)
        setRole(role);
        setIdProject(role.idProject)
        localStorage.setItem(storageProject, JSON.stringify({
            urn: urn, role: role.idRole.nameRole, idProject: role.idProject
        }));
    }, [])

    const removeProject = useCallback(() => {
        setUrn(null);
        setRole(null);
        setIdProject(null);
        localStorage.removeItem(storageProject);
    }, [])

    useEffect( () => {
        const userLocalStorage = JSON.parse(localStorage.getItem(storageName));
        const projectLocalStorage = JSON.parse(localStorage.getItem(storageProject));
        if (userLocalStorage && userLocalStorage.token) {
            login(userLocalStorage.token, userLocalStorage.userId);
        }
        if (projectLocalStorage) {
            setUrn(projectLocalStorage.urn);
            setRole(projectLocalStorage.role);
            setIdProject(projectLocalStorage.idProject);
        }
        setReady(true);
    }, [login])

    return { login, logout, token, userId, ready, addProject, removeProject, urn, role, idProject }
}