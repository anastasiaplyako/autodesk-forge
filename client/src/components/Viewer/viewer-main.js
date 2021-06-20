import React, {useContext, useEffect, useState} from 'react'
import {AuthContext} from "../../context/auth.context";
import './style/viewer.scss';
import './style/notesObject.scss';
import './style/menu-project.scss';
import {ViewerMethods} from "./ViewerMethods";
import {Workset} from "./workset";
import {initiateDocumentBrowser} from "./methods";
import {Checkbox} from "./checkbox";
import {resultObject, translateObject} from "./status-object";
const Autodesk = window.Autodesk;
var viewer;
let resultWorksetId = [];

const ViewerMain = () => {
    const [project, setProject] = useState({});
    const [workset, setWorkset] = useState(new Set());
    const [isError, setIsError] = useState(false);
    const [checkedItems, setCheckedItems] = useState({});
    const auth = useContext(AuthContext);
    const [urn, setUrn] = useState(auth.urn);
    const initialViewer = async (urn) => {
        const workset = new Workset();
        const requestToken = await fetch('/api/forge/oauth/token');
        const tokenAll = await requestToken.json();
        const viewerMethods = new ViewerMethods(urn)

        const worksetObjectid = workset.getWorkset(urn).then(res => {
            setWorkset(res);
        });

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

            console.log('Initialization complete, loading a model next...');

            function onDocumentLoadSuccess(doc) {
                let htmlDiv = document.getElementById('forgeViewer');
                initiateDocumentBrowser(viewer, doc);
            }
        });
    }

    useEffect(() => {
        resultObject(urn)
            .then(res => {})
            .catch((e) => {
                setIsError(true);
                console.log(e);
            })
        initialViewer(urn).then()
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
                            console.log("TRANSLATE", res)
                        })
                    }
                    }>Start translation</button>
                </>
            }
        </>
    )
}

export default ViewerMain
