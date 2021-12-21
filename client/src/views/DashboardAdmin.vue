<template>
  <admin-layout>
    <section class="py-8 flex">
      <div class="container px-4 mx-auto flex-1">
        <h2 class="text-3xl font-normal leading-normal mt-0 mb-2">
          Crypto table
        </h2>
        <CryptoTable />
        <hr />
      </div>
      <div class="container px-4 mx-auto flex-1">
        <h2 class="text-3xl font-normal leading-normal mt-0 mb-2">
          Feeds table
        </h2>
        <FeedsTable />
      </div>
    </section>
  </admin-layout>
</template>

<script>
import CryptoTable from "../components/dashboard/admin/CryptoTable.vue";
import FeedsTable from "../components/dashboard/admin/FeedsTable.vue";
export default {
  name: "DashboardAdmin",
  components: {
    adminLayout: () => import("../layout/AdminLayout.vue"),
    CryptoTable,
    FeedsTable,
  },
};
</script>
