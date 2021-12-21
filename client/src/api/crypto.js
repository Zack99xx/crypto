import axios from "axios";

export const getCryptos = async (cryptos, currency) => {
  return await axios.get(
    "http://localhost:8000/cryptos",
    {
      params: {
        cmids: cryptos,
        crids: currency,
      },
    },
    {
      headers: {
        accept: "application/json",
      },
    }
  );
};

export const getAvailableCrypto = async () => {
  return await axios.get("http://localhost:8000/cryptos/list/all", {
    headers: {
      accept: "application/json",
    },
  });
};

export const get_crypto_history = async (cryptoId, period) => {
  return await axios.get(
    `http://localhost:8000/cryptos/${cryptoId}/history/${period}`,
    {
      headers: {
        accept: "application/json",
      },
    }
  );
};
