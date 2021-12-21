import axios from "axios";
import { parseJwt } from "../utils/global";

export const create_user = async (email, username, password) => {
  return await axios.post(
    "http://localhost:8000/users",
    {
      email,
      username,
      password,
    },
    {
      headers: {
        accept: "application/json",
      },
    }
  );
};

export const update_user_fav = async (favCrypto) => {
  const userId = parseJwt(window.localStorage.getItem("jwt-token")).id;

  return await axios.put(
    "http://localhost:8000/users/" + userId,
    {
      favorites: favCrypto,
    },
    {
      headers: {
        accept: "application/json",
      },
    }
  );
};

export const update_user_data = async (email, username) => {
  const userId = parseJwt(window.localStorage.getItem("jwt-token")).id;

  return await axios.put(
    "http://localhost:8000/users/" + userId,
    {
      email,
      username,
    },
    {
      headers: {
        accept: "application/json",
      },
    }
  );
};
export const get_user = async () => {
  const userId = parseJwt(window.localStorage.getItem("jwt-token")).id;

  return await axios.get("http://localhost:8000/users/" + userId, {
    headers: {
      accept: "application/json",
    },
  });
};
