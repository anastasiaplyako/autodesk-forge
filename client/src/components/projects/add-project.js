import React, {useContext, useState} from 'react';
import {AuthContext} from "../../context/auth.context";

export const AddProject = (props) => {
    const auth = useContext(AuthContext);
    const [files, setFiles] = useState([]);

    const changeHandler = (event) => {
        setFiles(event.target.files);
    }

    const fetchProject = async () => {
        const formData = new FormData();
        formData.append('fileToUpload', files[0]);
        formData.append('bucketKey', props.idBucket);
        await fetch('/api/forge/oss/objects', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${auth.token}`
            },
            body: formData
        });
        fetch(`/api/forge/oss/buckets?id=${props.idBucket}`, {
            headers: {
                'Authorization': `Bearer ${auth.token}`
            },
        })
            .then(res => {
                const res1 = res;
                return res1.json();
            })
            .then(res => {})
    }

    return (
        <>
            <input multiple type="file" onChange={changeHandler}/>
            <button onClick={fetchProject}>Загрузить</button>
        </>
    )
}

