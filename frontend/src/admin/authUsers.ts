import { fetchUtils } from 'react-admin';

const httpClient = (url: string, options?: any) => {
    if (!options.headers) {
        options.headers = new Headers({
            'Content-Type': 'application/json'
        });
    }
    const token = localStorage.getItem('token');
    options.headers.set('Authorization', 'Bearer ' + token);
    return fetchUtils.fetchJson(url, options);
};

export default httpClient;