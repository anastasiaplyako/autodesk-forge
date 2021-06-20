import React, {useEffect, useState} from 'react';
import './notes.scss';
const config = require("../../config.json")
const isReady = 'Готово';
const isChange = 'Изменить';

export const PrimitiveNotes = (props) => {
    const type = props.type;
    const [note, setNote] = useState('');
    const [noteObject, setNoteObject] = useState('');
    const [isUpdate, setIsUpdate] = useState(false);
    const [textButton, setTextButton] = useState(isChange);
    const [isUpdateObject, setIsUpdateObject] = useState(false);

    useEffect(() => {
        if (type === config.TYPE_NOTE) {
            setNote(props.note.note)
        } else {
            setNoteObject(props.note.note);
        }
    }, [])

    const changeHandler = (event) => {
        if (type === config.TYPE_NOTE) {
            setNote(event.target.value);
        } else {
            setNoteObject(event.target.value);
        }
    }

    const updateNotes = () => {
        if (textButton === isChange) {
            setTextButton(isReady);
            if (type === config.TYPE_NOTE) {
                setIsUpdate(true);
            } else {
                setIsUpdateObject(true);
            }
        } else {
            let url = '';
            let changeNote;
            if (type === config.TYPE_NOTE) {
                url = '/update';
                changeNote = note;
            } else {
                url = '/updateObject';
                changeNote = noteObject;
            }
            fetch(`/api/forge/notes${url}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: props.note._id,
                    note: changeNote,
                })
            }).then(() => {
                setTextButton(isChange)
                if (type === config.TYPE_NOTE) {
                    setIsUpdate(false);
                } else {
                    setIsUpdateObject(false);
                }
            })
        }

    }

    return (
        <div className="note">
            <div className="note_delete">
                <button
                    className="note_buttons__close"
                    onClick={props.deleteNote}
                >
                    x
                </button>
            </div>
            {(note || isUpdate) && <div className="note_text">
                <h5>{props.note.type}</h5>
                {
                    isUpdate ?
                        <textarea
                            type="text"
                            value={note}
                            placeholder="Замечание"
                            onChange={changeHandler}
                        />
                        :
                        <p>{note}
                    </p>
                }

                <div className="note_buttons">
                    <button
                        className="note_buttons__change"
                        onClick={updateNotes}
                    >{textButton}</button>
                </div>
            </div>}
            {(noteObject || isUpdateObject) && <div className="note_text">
                {
                    isUpdateObject ?
                        <textarea
                            type="text"
                            value={noteObject}
                            placeholder="Замечание"
                            onChange={changeHandler}
                        />
                        :
                        <p>{noteObject}
                        </p>
                }

                <div className="note_buttons">
                    <button
                        className="note_buttons__change"
                        onClick={updateNotes}
                    >{textButton}</button>
                </div>
            </div>}
        </div>
    )
}