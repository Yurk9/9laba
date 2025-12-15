import getEndpoints from '../server/db';

const endpoints = getEndpoints();

type ENDPOINTS = keyof typeof endpoints;

type RESPONSE_DATA = {
    greeting: string;
};

const getJson = async <T>(endpoint: ENDPOINTS): Promise<T> => {
    const path = 
    process.env.NODE_ENV === 'development'
    ? `http://localhost:3001/api/${endpoint}`
    : `https://raw.githubusercontent.com/dk0ov/gh-pages-demo/gh-pages/static/db/${endpoint}.json`;
    
    const response = await fetch(path);

    return await response.json();
};

type API = {
    get: {
        data: () => Promise<RESPONSE_DATA>;
    };
};
const api: API = {
    get: {
        data: () => getJson<RESPONSE_DATA>('data'),
    },
};

export type { RESPONSE_DATA, ENDPOINTS };
export default api;

save-json-api.js
const fs = require('node-fs');
const getDb = require('../db/index.js');

const db = getDb();

fs.mkdir('./build/static/db', () => {
    for (let [key, value] of Object.entries(db)) {
        fs.writeFile(
            `./build/static/db/${key}.json`,
            JSON.stringify(value),
            (err) => {
                if (err) throw err;
            }
        );
    }
});
