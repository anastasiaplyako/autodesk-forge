import React, {useContext, useState} from 'react';
import {AuthContext} from "../../context/auth.context";
import {Loader} from "../loader/loader";

export const CreateTable = (props) => {
    const [files, setFiles] = useState([]);
    const auth = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const sendFile = () => {
        setLoading(true);
        let numberSendFile = 0;
        Array.from(files).forEach(file => {
            let formData = new FormData();
            formData.append('fileToUpload', file);
            formData.append('idProject', auth.urn);

            fetch(props.url, {
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

    return (
        <>
            {loading ? <Loader />:
                <>
                    <span>Добавить таблицу</span>
                    <input type="file" multiple onChange={changeHandler}/>
                    <button onClick={sendFile}>Отправить</button>
                </>
            }
        </>
    )
}