import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from "../../context/auth.context";
import {Loader} from "../loader/loader";

export const CreateFile = () => {
    const auth = useContext(AuthContext);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [folders, setFolders] = useState([]);
    const [value, setValue] = useState({});

    const sendFile = () => {
        setLoading(true);
        let numberSendFile = 0;
        Array.from(files).forEach(file => {
            let formData = new FormData();
            formData.append('fileToUpload', file);
            formData.append('idProject', auth.idProject);
            formData.append('idFolder', JSON.parse(value)._id);
            fetch('/api/forge/file/createFile', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${auth.token}`
                },
                body: formData
            })
                .then(response => {
                    numberSendFile++;
                    if (numberSendFile === files.length) {
                        setLoading(false);
                    }
                })
        })
    }

    const changeHandler = (event) => {
        setFiles(event.target.files);
    }

    useEffect(() => {fetchFolders()}, [loading])

    const fetchFolders = () => {
        fetch(`/api/forge/folders/all?id=${auth.urn}`, {
            headers: {
                'Authorization': `Bearer ${auth.token}`
            }
        }).then(res => res.json()).then(res => {
            setFolders(res);
            setValue(JSON.stringify(res[0]));
        })
    }

    const changeOptionSelect = (event) => {
        setValue(event.target.value);
    }

    return (
        <>
            {loading ? <Loader />:
                <>
                <input type="file" multiple onChange={changeHandler}/>
                <select value={value} onChange={changeOptionSelect}>
                    {folders && folders.map(folder => {
                        return(
                            <option value={JSON.stringify(folder)}>{folder.nameFolder}</option>
                        )
                    })}
                </select>
                <button onClick={sendFile}>Отправить</button>
               </>
            }
        </>
    )
}
