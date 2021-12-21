<template>
  <admin-layout>
    <section class="relative py-20">
      <div class="container px-4 mx-auto">
        <div class="flex flex-wrap -m-3 mb-16">
          <div
            class="w-full md:w-1/2 lg:w-1/3 p-3"
            v-for="(article, i) in feeds"
            :key="i"
          >
            <div class="p-6 border rounded-xl bg-white">
              <div class="relative h-52 mb-6">
                <span
                  class="absolute top-0 right-0 mt-4 mr-4 text-xs text-white px-2 py-1 font-semibold bg-gray-600 bg-opacity-50 rounded-md uppercase"
                  >{{ article.source }}</span
                >
                <img
                  class="w-full h-full object-cover rounded-lg"
                  :src="article.image_url"
                  alt=""
                />
              </div>
              <span class="inline-block mb-4 text-xs text-gray-500">{{
                new Date(article.createdAt).toLocaleDateString()
              }}</span>
              <h2 class="mb-4 text-2xl font-semibold font-heading">
                {{ article.title }}
              </h2>
              <p class="mb-4 text-gray-500 leading-relaxed">
                {{ article.summary }}
              </p>
              <a
                class="text-lg font-medium text-red-500 underline hover:no-underline"
                target="_blank"
                :href="article.page_url"
                >En savoir plus</a
              >
            </div>
          </div>
        </div>
      </div>
    </section>
  </admin-layout>
</template>

<script>
import { get_rss_feeds } from "../api/rss";

export default {
  components: {
    adminLayout: () => import("../layout/AdminLayout.vue"),
  },
  data() {
    return {
      feeds: [],
    };
  },
  mounted() {
    get_rss_feeds().then((response) => {
      console.log(response);
      this.feeds = response.data.data;
    });
  },
};
</script>
