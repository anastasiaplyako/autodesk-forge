//let urn = 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dXJwMWF2ZHkycmlnZ2hhbHBvcWZpdmJwbDE1YnNheXotZ2YvS0lTXzE5XzExXzIwX05FVy5ydnQ'

const worksetObjectid = new Map();
let notEmptyMap = false;

export class Workset {
    getWorkset = async (urn) => {
        return fetch(`/api/forge/workset/token`)
            .then(res => res.json())
            .then(res => res.access_token)
            .then(token => {
                if (!urn) {return }
                return fetch(`https://developer.api.autodesk.com/modelderivative/v2/designdata/${urn}/metadata`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                })
                    .then(res => res.json())
                    .then(res => res.data.metadata.filter(item => item.role === '3d'))
                    .then(uid => {
                        if (!uid[0]) return;
                        return fetch(`https://developer.api.autodesk.com/modelderivative/v2/designdata/
                        ${urn}/metadata/${uid[0].guid}/properties`, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            },
                        })
                            .then(res => res.json())
                            .then(res => {
                                if (res.data) {
                                    res.data.collection.map((item, index ) => {
                                        if (item.properties['Идентификация']) {
                                            const workset = item.properties['Идентификация']['Рабочий набор'];
                                            const objectId = item.objectid;
                                            notEmptyMap = true;
                                            if (worksetObjectid.has(workset)) {
                                                worksetObjectid.get(workset).push(objectId);
                                            } else {
                                                worksetObjectid.set(workset, [objectId]);
                                            }
                                        }
                                    })
                                }
                                return worksetObjectid;
                            })
                    })
            })
    }
}