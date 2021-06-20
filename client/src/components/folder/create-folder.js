import React, {useContext, useState} from 'react';
import {AuthContext} from "../../context/auth.context";

export const CreateFolder = () => {
    const auth = useContext(AuthContext);
    const [folder, setFolder] = useState('');

    const handleSubmit = async (event) => {
        try {
            await fetch('/api/forge/folders/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                },
                body: JSON.stringify({
                    folder: folder,
                    urn: auth.urn
                })
            })
            setFolder('');
        } catch (e) {
            console.log(e);
        }
    }

    const handleChange = (event) => {
        setFolder(event.target.value);
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                <input type="text" value={folder} name="name" onChange={handleChange}/>
            </label>
            <input type="submit" value="Отправить" />
        </form>
    )
}