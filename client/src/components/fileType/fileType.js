import React, {useContext, useEffect, useState} from 'react';
import {File} from "./file";
import {useParams} from "react-router-dom";
import './files.scss';
import {AuthContext} from "../../context/auth.context";
import {Loader} from "../loader/loader";

export const FileType = () => {
    const auth = useContext(AuthContext);
    const [files, setFiles] = useState([{}])
    const urn = auth.urn;
    const type = useParams().id;
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        fetch('/api/forge/models/fileType', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                urn: urn,
                type: type,
            })
        })
            .then(res => res.json())
            .then(res => {
                setFiles(res);
                setLoader(true);
            })
    }, [])


    return (
        <>
            {!loader && <Loader/>}
            <div className="files">
                {loader && files.map(file => {
                    return (
                        <div>
                            <File
                                file={file}
                                urn={urn}
                                type={type}
                                key={file._id}
                            />
                        </div>
                    )
                })}
            </div>
        </>
    )
}
