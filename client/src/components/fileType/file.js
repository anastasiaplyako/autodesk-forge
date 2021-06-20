import React, {useEffect, useState} from 'react';
import {PrimitiveFile} from "./primitiveFiles";
import './files.scss';

export const File = (props) => {
    const [isLoad, setIsload] = useState(false);
    const [url, setUrl] = useState('');


    useEffect(() => {
        getUrl();
    }, [])

    const getUrl = () => {
        fetch('/api/forge/models/getFile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fileId: props.file._id
            })
        })
            .then(response => response.blob())
            .then(blob => {
                let urlFile = URL.createObjectURL(blob);
                setUrl(urlFile);
                setIsload(true);
            });
    }

    return (
        <div className="file">
            {props.file._id && url &&
            <div>
                <PrimitiveFile file={props.file} url={url}/>
            </div>
            }
        </div>
    )
}
