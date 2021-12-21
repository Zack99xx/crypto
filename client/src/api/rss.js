import axios from "axios";

export const get_rss_feeds = async () => {
  return await axios.get("http://localhost:8000/articles", {
    headers: {
      accept: "application/json",
    },
  });
};

const d = "2021-12-16T14:30:42.793Z";

const x = new Date(d).toLocaleDateString();
x;
