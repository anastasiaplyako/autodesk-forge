import React, {useEffect, useState, useContext} from 'react';
import {Folder} from "./folder";
import './folder.scss'
import {AuthContext} from "../../context/auth.context";
import {Menu} from "../menu/menu";

export const Folders = () => {
    const [foldersInfo, setFoldersInfo] = useState([]);
    const [project, setProject] = useState([])
    const auth = useContext(AuthContext);
    const urn = auth.urn;
    const imgPath = (project && project.img) ? `/img/${project.img}` : '';

    const getFolders = () => {
        fetch(`/api/forge/folders/all?id=${urn}`, {
            headers: {
                'Authorization': `Bearer ${auth.token}`
            }
        }).then(res => res.json()).then(res => {
            setFoldersInfo(res);
        })
    }

    useEffect(() => {
        getFolders();
    }, [])

    return (
        <div>
            <Menu />
            <div className="folders">
                {
                    foldersInfo.map(folder => {
                        return (
                            <Folder folder={folder} key={folder._id}/>
                        )
                    })}
            </div>
        </div>
    )
}