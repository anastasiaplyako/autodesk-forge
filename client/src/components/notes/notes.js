import React, {useContext, useEffect, useState} from 'react';
import {PrimitiveNotes} from "./primitiveNotes";
import './notes.scss';
import {AuthContext} from "../../context/auth.context";
import {Menu} from "../menu/menu";
const config = require("../../config.json")

export const Notes = () => {
    const auth = useContext(AuthContext)
    const urn = auth.urn;

    const [notes, setNotes] = useState([])
    const [notesObject, setNotesObject] = useState([]);
    const [url, setUrl] = useState('');

    const readNotes = () => {
        let urls = [
            `/api/forge/notes/read?id=${auth.idProject}`,
            `/api/forge/notes/getObject?urn=${urn}`
        ];

        let requests = urls.map(url => fetch(url, {
            headers: {
                'Authorization': `Bearer ${auth.token}`
            }
        }));

        Promise.all(requests)
            .then(responses => {
                return responses;
            })
            .then(responses => Promise.all(responses.map(r => r.json())))
            .then(res => res.forEach((item, index) => {
                switch(index) {
                    case(0): {
                        setNotes(item);
                        break;
                    }
                    case(1): {
                        setNotesObject(item);
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }));
    }

    useEffect(() => {
        readNotes();
    }, [])

    const deleteNote = (_id, index, type) => {
        const url = (type === config.TYPE_NOTE) ? '/delete' : '/deleteObject'
        fetch(`/api/forge/notes${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            },
            body: JSON.stringify({
                urn: urn,
                _id: _id
            })
        })
            .then(res => res.status)
            .then(status => {
                if (status === 200) {
                    window.location.reload();
                }
            })
    }

    const sendNotes = () => {
        fetch(`/api/forge/email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            },
            body: JSON.stringify({
                notesObject,
                notes,
                idProject: auth.idProject
            })
        })
            .then(res => res.json())
            .then(res => {
                setUrl(res.url);
            })
    }

    return (
        <div>
            <Menu />
            <div className="send">
                <button onClick={sendNotes}>Отправить замечания владельцу</button>
            </div>
            {url && <a href={url} target="_blank">Сформированный файл</a>}
            <h4>Замечания к документации </h4>
            <div className="notes" id="notes">
                <div className="notes_row">
                    {notes &&
                    notes.map((note, index) => {
                        return (
                            <PrimitiveNotes
                                note={note}
                                type={config.TYPE_NOTE}
                                deleteNote={() => deleteNote(note._id, index, config.TYPE_NOTE)}
                            />
                        )
                    })
                    }
                </div>
                <h4>Замечания к модели </h4>
                <div className="notes_row">
                    {notesObject &&
                    notesObject.map((note, index) => {
                        return (
                            <PrimitiveNotes
                                note={note}
                                type={config.TYPE_NOTE_OBJECT}
                                deleteNote={
                                    () => deleteNote(note._id, index, config.TYPE_NOTE_OBJECT)
                                }
                            />
                        )
                    })
                    }
                </div>

            </div>
        </div>
    )
}
