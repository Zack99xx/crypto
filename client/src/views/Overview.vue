<template>
  <admin-layout>
    <FavCryptoWrapper />
    <CryptoCurrencyListWrapper />
  </admin-layout>
</template>

<script>
export default {
  components: {
    FavCryptoWrapper: () =>
      import("../components/dashboard/FavCryptoWrapper.vue"),
    CryptoCurrencyListWrapper: () =>
      import("../components/dashboard/CryptoCurrencyListWrapper.vue"),
    adminLayout: () => import("../layout/AdminLayout.vue"),
  },

  methods: {
    logout() {
      this.$store.dispatch("user/logout");
      this.$router.push("/login");
      this.$toast.success("Vous avez été déconnecté");
    },
  },
};
</script>
