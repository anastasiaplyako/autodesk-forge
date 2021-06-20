const config = require("../../config.json");

const getToken = async () => {
    const resToken = await fetch('/api/forge/token/');
    const token = await resToken.json();
    return token.access_token
}

export const resultObject = async (urn) => {
    const accessToken = await getToken();
    const res = await fetch(`https://developer.api.autodesk.com/modelderivative/v2/designdata/${urn}/manifest`, {
        headers: { 'Authorization': 'Bearer ' + accessToken },
    })
    const statusObject = await res.json();
}

export const translateObject = async (urn, bucketKey) => {
    const res = await fetch('/api/forge/modelderivative/jobs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'bucketKey': bucketKey, 'objectName': urn }),
    })
        .then(res => res.json())
        .then(res => {
            return res.status;
        })
}