import axios from "axios";
import { generateUUID } from "../../utils/usefull.js";

export const addCrypto = (id, fullName) => {
    return axios.post(
        "http://localhost:8000/cryptos",
        {
            id, 'full_name': fullName, image_url: generateUUID(),
            headers: {
                accept: "application/json",
            }
        }
    );
};

export const getCryptos = (cryptos) => {
    return axios.get(
        "http://localhost:8000/cryptos",
        {
            params: {
                cmids: cryptos
            }
        },
        {
            headers: {
                accept: "application/json",
            }
        }
    );
};

export const getAllCryptos = () => {
    return axios.get(
        "http://localhost:8000/cryptos/list/all", {},
        {
            headers: {
                accept: "application/json",
            }
        }
    );
};

export const getAllCryptoCompareCryptos = () => {
    return axios.get(
        "https://min-api.cryptocompare.com/data/blockchain/list?api_key=d2eff54ab35722ad66c3dead73f5e65ebdb1c20e966eb7e220011f46c852e3ba", {},
        {
            headers: {
                accept: "application/json",
            }
        }
    );
};

export const deleteCrypto = (id) => {
    return axios.delete(
        "http://localhost:8000/cryptos/" + id, {},
        {
            headers: {
                accept: "application/json",
            }
        }
    );
};