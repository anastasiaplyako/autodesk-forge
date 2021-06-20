import React, {useContext, useEffect, useState} from 'react'
import {AuthContext} from "../../context/auth.context";
import './style/viewer.scss';
import './style/notesObject.scss';
import './style/menu-project.scss';
import {PrimitiveNotesObject} from "./primitiveNotesObject";
import {Workset} from "./workset";
import {initiateDocumentBrowser} from "./methods";
import {Checkbox} from "./checkbox";
import {resultObject, translateObject} from "./status-object";
const Autodesk = window.Autodesk;
var viewer;
let resultWorksetId = [];

const Viewer = () => {
    const [isError, setIsError] = useState(false);
    const [objectNotes, setObjectNotes] = useState([{}]);
    const [project, setProject] = useState({});
    const [workset, setWorkset] = useState(new Set());
    const [inputId, setInputId] = useState();
    const [isActivate, setIsActivate] = useState(false);
    const [checkedItems, setCheckedItems] = useState({});
    const [note, setNote] = useState();
    const highLightNotes = [];
    const auth = useContext(AuthContext);
     const [urn, setUrn] = useState(auth.urn);
    const createNotes = (inputId) => {
        setObjectNotes([...objectNotes, {
            idNoteObject: inputId,
            note: note, inputId,
            urn: urn
        }]);
        fetch('/api/forge/notes/addObject', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                urn: urn,
                idNoteObject: inputId,
                textNoteObject: note
            })
        }).then(res => {
            if (res.ok) {
                alert("ok!");
                setIsActivate(false);
                //this.deleteInput();
            }
        })
    }

    const initialViewer = async (urn) => {
        const workset = new Workset();
        const requestToken = await fetch('/api/forge/oauth/token');
        const tokenAll = await requestToken.json();

        const worksetObjectid = workset.getWorkset(urn).then(res => {
            console.log("res WORKSET= ", res);
            setWorkset(res);
        });
        console.log("worksetObjectid", worksetObjectid);

        var options = {
            env: 'AutodeskProduction',
            api: 'derivativeV2',  // for models uploaded to EMEA change this option to 'derivativeV2_EU'
            getAccessToken: function (onTokenReady) {
                var token = tokenAll.access_token
                var timeInSeconds = tokenAll.expires_in; // Use value provided by Forge Authentication (OAuth) API
                onTokenReady(token, timeInSeconds);
            }
        };

        function onDocumentLoadFailure() {
            console.error('Failed fetching Forge manifest');
        }

        Autodesk.Viewing.Initializer(options, function () {

            let htmlDiv = document.getElementById('forgeViewer');
            viewer = new Autodesk.Viewing.GuiViewer3D(htmlDiv, {});
            var startedCode = viewer.start();
            if (startedCode > 0) {
                console.error('Failed to create a Viewer: WebGL not supported.');
                return;
            }
            var documentId = `urn:${urn}`;
            Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);

            function onDocumentLoadSuccess(doc) {
                let htmlDiv = document.getElementById('forgeViewer');
                initiateDocumentBrowser(viewer, doc);
                viewer.addEventListener(Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT, function (curr_object) {
                    if (curr_object.selections[0]) {
                        let curr_dbid = curr_object.selections[0].dbIdArray[0];
                        viewer.model.getProperties(curr_dbid, function (curr_prop) {
                            setIsActivate(true);
                            setInputId(curr_prop.dbId);
                        });
                    }
                });
                setIsActivate(false);
            }
        });
    }

    useEffect(() => {
        resultObject(urn)
            .then(res => {})
        .catch((e) => {
            setIsError(true);
            console.log("error");
            console.log(e);
        })
        initialViewer(urn).then()
        fetch(`/api/forge/notes/getObject?urn=${urn}`)
            .then(res => res.json())
            .then(res => {
                setObjectNotes(res)
            })
        fetch(`/api/forge/project/readProject?id=${auth.idProject}`)
            .then(res => res.json())
            .then(res => {
                setProject(res)
            })
    }, [])

    const isolateWorkset = () => {
        let allId = [];
        resultWorksetId.map(workset => {
            allId.push(...workset.worksetId);
        })
        allId.map(id => {
        })
        viewer.isolate(allId)
    }

    const changeHandler = (event) => {
        setNote(event.target.value);
    }

    const selectElement = (id) => {
        hideHighlightElement();
        highLightNotes.push(id);
        viewer.impl.highlightObjectNode(
            viewer.model, +id, true, true);
    }

    const hideHighlightElement = () => {
        let htmlDiv = document.getElementById('forgeViewer');
        highLightNotes.map(id => {
            viewer.impl.highlightObjectNode(
                viewer.model, +id, false, false);
        })
    }

    const handleChange = event => {
        if (event.target.checked) {
            resultWorksetId.push({
                worksetName: event.target.name,
                worksetId: workset.get(event.target.name)
            })
        } else {
            resultWorksetId = resultWorksetId.filter(item => item.worksetName !== event.target.name);
        }
        isolateWorkset();
        setCheckedItems({
            ...checkedItems,
            [event.target.name]: event.target.checked
        });
    };

    return (
        <>
        {!isError ? <div className="container">
            {isActivate &&
            <div>
                <input
                    id={inputId}
                    type="text"
                    className="text"
                    onChange={changeHandler}
                />
                <input
                    className="submit"
                    type="submit"
                    onClick={() => createNotes(inputId)}
                />
            </div>
            }
            <div className="notesObject">
                <span className="span__header">Замечания</span>
                {
                    objectNotes && objectNotes.map(note => {
                        return(
                            <PrimitiveNotesObject
                                note={note}
                                selectElement={() => selectElement(note.idNoteObject)}
                            />
                        )
                    })
                }
            </div>
            <div className="menu_project">
                <li><a href="#">Меню</a>
                    <ul className="submenu">
                        {workset && [...workset.keys()].map(item => (
                            <label key={item}>
                            {item}
                            <Checkbox
                            name={item}
                            id={workset.get(item)}
                            checked={checkedItems[item]}
                            onChange={handleChange}
                            />
                            </label>
                        ))}
                    </ul>
                </li>
            </div>
            <div id="forgeViewer" />
        </div>
            :
            <>
                <h4>This file is not translate</h4>
                <button onClick={() => {
                    translateObject(urn, project.bucket).then(res => {
                        console.log("resTRANSLATE", res)
                    })
                }
                }>Start translation</button>
            </>
        }
        </>
    )
}

export default Viewer
