import React from 'react';
import {CreateFolder} from "../folder/create-folder";
import {CreateFile} from "../fileDocumentation/create-file";
import {Menu} from "../menu/menu";
import "./edit-documentation.scss";

export const EditDocumentation = () => {
    return (
        <>
            <Menu />
            <div className="edit-item">
                <span>Создать папку</span>
                <CreateFolder />
            </div>
            <div className="edit-item">
                <span>Загрузить файл</span>
                <CreateFile />
            </div>
        </>
    )
}