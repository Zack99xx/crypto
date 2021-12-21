<template>
  <div>
    <div id="buttons-space">
      <button
        class="
          bg-red-500
          hover:bg-red-700
          text-white
          font-bold
          py-2
          px-4
          rounded
        "
        @click="onDelete()"
      >
        Delete
      </button>
      <button
        class="
          bg-blue-500
          hover:bg-blue-700
          text-white
          font-bold
          py-2
          px-4
          rounded
        "
        @click="onClickAddButton()"
      >
        Add
      </button>
    </div>
    <table class="table-auto w-full">
      <thead class="bg-gray-50">
        <tr class="text-xs text-gray-500 text-left">
          <th class="flex items-center pl-6 py-4 font-medium">
            <span>RSS Feeds</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="border-b border-blue-50"
          v-for="(feed, index) in feeds"
          :key="index"
        >
          <td class="flex items-center py-4 px-6 font-medium">
            <input
              type="checkbox"
              name=""
              id=""
              class="mr-3"
              v-model="feed.isSelected"
            />
            <div class="flex px-4 py-3">
              <img
                :src="feed.image_url"
                alt=""
                class="w-8 h-8 mr-4 object-cover rounded-md"
              />
              <div>
                <p class="text-sm font-medium">{{ feed.key }}</p>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <Modal ref="modal">
      <h1 slot="title">Add Feed</h1>
      <div slot="content">
        <select
          ref="select"
          class="
            form-select
            appearance-none
            block
            w-full
            px-3
            py-1.5
            text-base
            font-normal
            text-gray-700
            bg-white bg-clip-padding bg-no-repeat
            border border-solid border-gray-300
            rounded
            transition
            ease-in-out
            m-0
            focus:text-gray-700
            focus:bg-white
            focus:border-blue-600
            focus:outline-none
          "
        >
          <option selected disabled>Please select a Feed</option>
          <option
            v-for="(feed, index) in existingFeeds"
            :key="index"
            :value="feed.key"
          >
            {{ feed.name }}
          </option>
        </select>
      </div>
      <div slot="confirm-button" @click="onAdd">Add</div>
    </Modal>
  </div>
</template>

<script>
import {
  addFeed,
  getAllFeeds,
  deleteFeed,
  getAllExistingFeeds,
} from "../../../api/admin/feeds";

import Modal from "./Modal.vue";

export default {
  name: "FeedsTable",
  components: { Modal },
  data() {
    return {
      feeds: [],
      existingFeeds: [],
    };
  },
  async mounted() {
    this.initTable();
    this.existingFeeds = await getAllExistingFeeds().then((response) => {
      return response.data.data;
    });
  },
  methods: {
    async initTable() {
      this.feeds = await getAllFeeds().then((response) => {
        return response.data.data;
      });
    },
    onClickAddButton() {
      this.$refs.modal.toggleModal();
    },
    async onAdd() {
      let key = this.$refs.select.value;
      let feedName =
        this.$refs.select.options[this.$refs.select.selectedIndex].text;
      await addFeed(key)
        .then(() => {
          this.$swal.fire("Added!", "You well added " + feedName, "success");
        })
        .catch(() => {
          this.$swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
        });
      this.initTable();
    },
    async onDelete() {
      this.$swal
        .fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete!",
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            let feeds = [];
            for (const [, f] of Object.entries(this.feeds))
              if (f.isSelected === true) feeds.push(f.key);
            console.log("*", "Feeds", feeds);
            for (const f of feeds) {
              console.log("*", f);
              await deleteFeed(f);
            }
            this.$swal.fire(
              "Deleted!",
              "Your feed have been deleted.",
              "success"
            );
            this.initTable();
          }
        });
    },
  },
};
</script>

<style scoped>
#buttons-space {
  margin-bottom: 5px;
}

#buttons-space > button {
  margin: 3px;
}
</style>