import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from "../../context/auth.context";
import {useParams} from "react-router-dom";
import {FileTextOutlined, CloseOutlined} from '@ant-design/icons';
import "./file.scss";
import {Menu} from "../menu/menu";

export const GetFile = () => {
    const auth = useContext(AuthContext);
    const [files, setFiles] = useState('');
    const idFolder = useParams().id;
    const isAdmin = auth.role === 'admin';

    useEffect(() => {
        fetch(`/api/forge/file/getFile?id=${idFolder}`, {
            headers: {
                'Authorization': `Bearer ${auth.token}`,
            }
        })
            .then(res => res.json())
            .then(res => {
                setFiles(res.files);
            })
    }, [])

    const deleteFile = idFile => {
        fetch(`/api/forge/file/delete?id=${idFile}`, {
            headers: {
                'Authorization': `Bearer ${auth.token}`,
            }
        })
            .then(res => {
                if (res.ok) {
                    alert("ok!");
                    setFiles(files.filter(file => file._id !== idFile));
                } else {
                    alert("error!");
                }
            })
    }

    return (
        <>
            <Menu/>
            <div className="container-file">
                {files && files.map(file => {
                    return (
                        <div key={file._id} className="card-file">
                            {isAdmin && <CloseOutlined onClick={() => {
                                deleteFile(file._id)
                            }}/>}
                            <a href={file.url} target="_blank">
                                <FileTextOutlined/>
                                <p>{file.originalName}</p>
                            </a>
                        </div>
                    )
                })}
            </div>
        </>
    )
}