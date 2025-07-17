import axios from 'axios';

/**
 * @param {string} url
 */
export async function getData(url, { token = "", params = {} }) {
    try {
        if (!url) {
            throw new Error('URL is required');
        }

        // Menyusun parameter query string
        // @ts-ignore
        const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
        const fullUrl = queryString ? `${url}?${queryString}` : url;

        const headers = {
            'Content-Type': 'application/json'
        };

        if (token) {
            // @ts-ignore
            headers.Authorization = `Bearer ${token}`;
        }

        const res = await axios.get(
            fullUrl,
            {
                headers: headers
            }
        );
        const data = res.data;
        return data;
    } catch (error) {
        return error;    
    }
}

/**
 * @param {string} url
 */
export async function patchData(url, { token = "", dataUpdate = {}, params = {} }) {
    try {
        if (!url) {
            throw new Error('URL is required');
        }

        // @ts-ignore
        const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
        const fullUrl = queryString ? `${url}?${queryString}` : url;

        const headers = {
            'Content-Type': 'application/json'
        };

        if (token) {
            // @ts-ignore
            headers.Authorization = `Bearer ${token}`;
        }

        const res = await axios.patch(
            fullUrl,
            dataUpdate,
            {
                headers: headers
            }
        );
        const data = res.data;
        return data;
    } catch (error) {
        return error;
    }
}

/**
 * @param {string} url
 */
export async function postData(url, { token = "", dataUpdate = {}, params = {} }) {
    try {
        if (!url) {
            throw new Error('URL is required');
        }

        // Menyusun parameter query string
        // @ts-ignore
        const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
        const fullUrl = queryString ? `${url}?${queryString}` : url;

        const res = await axios.post(
            fullUrl,
            dataUpdate,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        const data = res.data;
        return data;
    } catch (error) {
        // @ts-ignore
        return error
    }
}


export async function deleteData(url, {token = "", params = {}}){
    try {
        if (!url) {
            throw new Error('URL is required');
        }

        // @ts-ignore
        const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
        const fullUrl = queryString ? `${url}?${queryString}` : url;

        const headers = {
            'Content-Type': 'application/json'
        };

        if (token) {
            // @ts-ignore
            headers.Authorization = `Bearer ${token}`;
        }
        const res = await axios.delete(fullUrl, {
            headers
        })
        const data = res.data;
        return data;
    } catch (error) {
        // @ts-ignore
        return error;
    }
}