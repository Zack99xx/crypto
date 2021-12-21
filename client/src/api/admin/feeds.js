import axios from "axios";

export const addFeed = (key) => {
    return axios.post(
        "http://localhost:8000/rss",
        {
            key, image_url: 'https://images.cryptocompare.com/news/default/' + key + '.png',
            headers: {
                accept: "application/json",
            }
        }
    );
};

export const getAllFeeds = () => {
    return axios.get(
        "http://localhost:8000/rss", {},
        {
            headers: {
                accept: "application/json",
            }
        }
    );
};

export const getAllExistingFeeds = () => {
    return axios.get(
        "http://localhost:8000/rss/all", {},
        {
            headers: {
                accept: "application/json",
            }
        }
    );
};

export const deleteFeed = (id) => {
    return axios.delete(
        "http://localhost:8000/rss/" + id, {},
        {
            headers: {
                accept: "application/json",
            }
        }
    );
};