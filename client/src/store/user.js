export const user = {
  namespaced: true,
  state: () => ({
    data: {
      id: "",
      username: "",
      email: "",
      role: "",
      favorites: [],
    },
    session: {
      logged: false,
      token: "",
    },
    currency: "EUR",
  }),
  getters: {
    session: (state) => {
      return state.session;
    },
    userData: (state) => {
      return state.data;
    },
  },
  mutations: {
    setUserData(state, userData) {
      state.data = userData;
    },
    setSession(state, sessionData) {
      state.session = sessionData;
      localStorage.setItem("jwt-token", sessionData.token);
    },
    setCurrency(state, currency) {
      state.currency = currency;
    },
  },
  actions: {
    login({ commit }, payload) {
      const { username, email, token, id, role, favorites, password } = payload;

      commit("setUserData", { username, email, id, role, favorites, password });
      commit("setSession", { logged: true, token });
    },

    logout({ commit }) {
      commit("setSession", { logged: false, token: "" });
    },
  },
};
