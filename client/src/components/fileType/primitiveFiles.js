import React from 'react';

export const PrimitiveFile = (props) => {
    return (
        <div>
            {props.file._id &&
                <div>
                    <a
                        href={`../../uploadsDocumentation/${props.file.file.originalname}`}
                        target="_blank">
                        <img src="https://img.icons8.com/ultraviolet/40/000000/file.png"/>
                        <span>{props.file.file.originalname}</span>
                    </a>
                </div>
            }
        </div>
    )
}
