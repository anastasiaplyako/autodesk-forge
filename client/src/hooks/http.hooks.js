import {useState, useCallback} from 'react';

export const useHttp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const request = useCallback(async (url, method = "GET", body = "null", headers = {}) => {
        setLoading(true);
        if (body) {
            body = JSON.stringify(body);
            headers['Content-Type'] = 'application/json';
        }
        try {
            const response = await fetch(url, {method, body, headers});
            const data = await response.json();
            console.log("data = ", data);
            if (!response.ok) {
                throw new Error(data.message || "Error!");
            }
            setLoading(false);
            return data;
        } catch (e) {
            setLoading(false);
            setError(e.message);
            throw e;
        }

    }, [])

    const clearError = useCallback(() => setError(null), [])

    return {loading, request, error, clearError}
}