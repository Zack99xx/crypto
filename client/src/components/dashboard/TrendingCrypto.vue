<template>
  <div class="py-4 pb-0 bg-white rounded">
    <div class="px-6 pb-6 border-b border-blue-50 flex flex-row">
      <div>
        <h3 class="text-xl font-bold">Favoris</h3>
        <p class="text-sm text-gray-500">
          Votre liste de crypto monnaie favorites
        </p>
      </div>
      <div>
        <selectCurrency class="w-48" @update:currency="getCryptoList" />
      </div>
    </div>
    <el-table
      ref="multipleTable"
      :data="cryptoList"
      style="width: 100%"
      v-loading="isLoading"
    >
      <el-table-column property="fullName imageUrl symbol" label="Nom">
        <template slot-scope="scope">
          <div class="flex items-center">
            <img
              class="w-8 h-8 mr-4 object-cover rounded-md"
              :src="`https://www.cryptocompare.com${scope.row.imageUrl}`"
              :alt="scope.row.fullName"
            />
            <div>
              <p class="text-sm font-medium">{{ scope.row.fullName }}</p>
              <p class="text-xs text-gray-500">
                {{ scope.row.symbol }}
              </p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column property="price" label="Prix" />
    </el-table>
  </div>
</template>

<script>
import { getCryptos } from "../../api/crypto";
import { get_user } from "../../api/user";
import { formatPrice } from "../../utils/format";
import selectCurrency from "../selectCurrency.vue";

export default {
  components: {
    selectCurrency,
  },
  props: {
    favList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      cryptoList: [],
      defaultCurrency: "EUR",
      isLoading: false,
    };
  },
  mounted() {
    this.getCryptoList(this.defaultCurrency);
  },
  methods: {
    getCryptoList(currency) {
      this.isLoading = true;
      this.defaultCurrency = currency;
      get_user()
        .then(({ data }) => {
          const userFavList = data.data[0].favorites;

          getCryptos(userFavList, [this.defaultCurrency])
            .then(({ data }) => {
              const crypto = data.data;
              this.cryptoList = Object.keys(crypto).map((key) => {
                return {
                  fullName: crypto[key].FullName,
                  imageUrl: crypto[key][currency].IMAGEURL,
                  price: formatPrice(crypto[key][currency].PRICE, currency),
                  symbol: crypto[key][currency].FROMSYMBOL,
                };
              });
              this.isLoading = false;
            })
            .catch((e) => {
              this.$toast.error(e.message);
              this.isLoading = false;
            });
        })
        .catch(() => {
          this.$toast.error(
            "Erreur lors de la récupération de votre profil de favoris"
          );
        });
    },
  },
  watch: {
    favList() {
      console.log("value changed");
      this.getCryptoList(this.defaultCurrency);
    },
  },
};
</script>
