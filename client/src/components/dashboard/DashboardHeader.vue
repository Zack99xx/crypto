<template>
  <section class="py-5 px-6 bg-white shadow">
    <nav class="relative">
      <div class="flex items-center">
        <div class="flex w-full justify-end lg:hidden">
          <button class="flex items-center">
            <svg
              class="block h-4 w-4"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
            >
              <title>Mobile menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
            </svg>
          </button>
        </div>
        <el-drawer
          title="I am the title"
          :visible.sync="drawer"
          :with-header="false"
        >
          <div class="p-4">
            <div class="flex justify-end mb-2">
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="isFormDisabled = false"
                >Modifier</el-button
              >
            </div>
            <el-form ref="form" :model="form">
              <el-form-item>
                <el-input
                  :disabled="isFormDisabled"
                  size="medium"
                  v-model="form.email"
                  placeholder="Email"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-input
                  :disabled="isFormDisabled"
                  size="medium"
                  v-model="form.username"
                  placeholder="Username"
                ></el-input>
              </el-form-item>
              <el-form-item size="large" v-if="!isFormDisabled">
                <div class="flex items-center justify-end">
                  <div>
                    <el-button @click="isFormDisabled = true"
                      >Annuler</el-button
                    >
                    <el-button type="primary" @click="submit"
                      >Mettre à jour</el-button
                    >
                  </div>
                </div>
              </el-form-item>
            </el-form>
            <el-divider content-position="left">Profil utilisateur</el-divider>
            <div
              class="bg-white border border-gray-200 overflow-hidden sm:rounded-lg"
            >
              <div class="px-4 py-5 sm:px-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  Mon compte
                </h3>
                <p class="mt-1 max-w-2xl text-sm text-gray-500">
                  Données personnelles, résumé du profil
                </p>
              </div>
              <div class="border-t border-gray-200">
                <dl>
                  <div
                    class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
                  >
                    <dt class="text-sm font-medium text-gray-500">
                      Nom d'utilisateur
                    </dt>
                    <dd
                      class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2"
                    >
                      {{ userData.username }}
                    </dd>
                  </div>
                  <div
                    class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
                  >
                    <dt class="text-sm font-medium text-gray-500">
                      Adresse email
                    </dt>
                    <dd
                      class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2"
                    >
                      {{ userData.email }}
                    </dd>
                  </div>

                  <div
                    class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
                  >
                    <dt class="text-sm font-medium text-gray-500">
                      Crypto favorites
                    </dt>
                    <dd
                      class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2"
                    >
                      <ul
                        role="list"
                        class="border border-gray-200 rounded-md divide-y divide-gray-200"
                      >
                        <li
                          class="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
                          v-for="(crypto, i) in userData.favorites"
                          :key="i"
                        >
                          <div
                            class="w-0 flex-1 flex items-center text-blue-400"
                          >
                            <svg
                              class="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
                              ></path>
                            </svg>
                            <span class="ml-2 flex-1 w-0 truncate">
                              {{ crypto }}
                            </span>
                          </div>
                          <div class="ml-4 flex-shrink-0">
                            <a
                              href="#"
                              class="font-medium text-blue-600 hover:text-blue-500"
                            >
                              View
                            </a>
                          </div>
                        </li>
                      </ul>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </el-drawer>
        <div class="hidden lg:block ml-auto">
          <button class="flex items-center" @click="drawer = true">
            <div class="mr-3 text-right">
              <p class="text-sm">{{ userData.username }}</p>
              <p class="text-sm text-gray-500">{{ userData.email }}</p>
            </div>
            <div class="mr-2">
              <img
                class="w-10 h-10 rounded-full object-cover object-right"
                src="https://www.sciencesetavenir.fr/assets/img/2016/09/02/cover-r4x3w1000-5834b11017175-elon-musk.jpg"
                alt=""
              />
            </div>
          </button>
        </div>
      </div>
    </nav>
  </section>
</template>

<script>
import { get_user, update_user_data } from "../../api/user";
import { validateEmail } from "../../utils/validator";

export default {
  computed: {
    userData() {
      return this.$store.getters["user/userData"];
    },
  },
  mounted() {
    this.getUserData();
  },

  data() {
    return {
      drawer: false,
      isFormDisabled: true,
      form: {
        email: this.$store.getters["user/userData"].email,
        username: this.$store.getters["user/userData"].username,
      },
    };
  },
  methods: {
    getUserData() {
      get_user().then((response) => {
        console.log(response.data.data[0]);
        const { _id, username, email, role, favorites } = response.data.data[0];
        this.$store.commit("user/setUserData", {
          id: _id,
          username,
          email,
          role,
          favorites,
        });
      });
    },
    checkFormValidation() {
      if (!validateEmail(this.form.email)) {
        this.$toast.error("L'adresse email doit être renseignée");
        return false;
      } else if (this.form.username.length < 3) {
        this.$toast.error("Le nom d'utilisateur doit être renseigné");
        return false;
      } else {
        return true;
      }
    },
    submit() {
      const isFormValid = this.checkFormValidation();
      if (isFormValid) {
        this.$toast.success("Votre profil a été mis à jour");
        update_user_data(this.form.email, this.form.username).then(() => {
          this.getUserData();
          this.isFormDisabled = true;
        });
      }
    },
  },
};
</script>

<style>
* {
  box-sizing: border-box;
}
.v-modal {
  background-color: rgba(17, 97, 158, 0.3);
  backdrop-filter: blur(10px);
  opacity: unset;
}
</style>
