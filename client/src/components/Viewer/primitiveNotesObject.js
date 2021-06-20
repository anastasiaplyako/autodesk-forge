import React from 'react';

export const PrimitiveNotesObject = (props) => {

    return (
        <div className="notes-container">
            <span
                id={props.note.idNoteObject}
                className="objectNotes"
                onClick={props.selectElement}
            >
                {props.note.note}
            </span>
        </div>
    )
}
