<template>
  <div class="pt-4 bg-white shadow rounded">
    <div class="px-6 border-b border-blue-50">
      <div class="flex flex-wrap items-center mb-4">
        <div class="flex flex-row justify-between items-center w-full">
          <div>
            <h3 class="text-xl font-bold">Liste des crypto monnaies</h3>
            <p class="text-sm text-gray-500 font-medium">
              Liste des crypto monnaies disponibles sur le marché
            </p>
          </div>
          <el-input
            v-model="search"
            size="mini"
            placeholder="Votre crypto.."
            class="w-48 ml-auto mr-4"
            prefix-icon="el-icon-search"
            clearable
          />
          <selectCurrency class="w-48" @update:currency="getCryptoList" />
        </div>
      </div>
    </div>
    <div>
      <el-table
        ref="cryptoTable"
        :data="
          cryptoList.filter(
            (data) =>
              !search ||
              data.fullName.toLowerCase().includes(search.toLowerCase())
          )
        "
        :row-key="getRowKeys"
        style="width: 100%"
        v-loading="isLoading"
        @selection-change="handleSelectionChange"
        @expand-change="handleExpandChange"
      >
        <el-table-column
          type="selection"
          width="55"
          :reserve-selection="true"
        ></el-table-column>
        <el-table-column type="expand" property="history">
          <template slot-scope="scope">
            <apexchart
              v-if="scope.row.history.length"
              width="100%"
              height="200"
              type="line"
              :options="chartOptions"
              :series="scope.row.history"
            />
          </template>
        </el-table-column>
        <el-table-column property="fullName imageUrl" label="Nom">
          <template slot-scope="scope">
            <div class="flex items-center">
              <img
                class="w-8 h-8 mr-4 object-cover rounded-md"
                :src="`https://www.cryptocompare.com${scope.row.imageUrl}`"
                :alt="scope.row.fullName"
              />
              <div>
                <p class="text-sm font-medium">{{ scope.row.fullName }}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column property="price" label="Prix" />
        <el-table-column property="volume24hours" label="Volume 24h" />
        <el-table-column property="supply" label="Supply" />
        <el-table-column property="open24hour" label="Open 24h" />
        <el-table-column
          property="lastMarket"
          label="Last market"
          width="120"
        />
      </el-table>
      <div class="py-4 text-center" v-if="multipleSelection.length">
        <el-popconfirm
          title="Cette action écrasera votre liste actuelle"
          icon="el-icon-info"
          icon-color="red"
          confirm-button-text="Valider"
          cancel-button-text="Annuler"
          @confirm="updateFav"
        >
          <el-button slot="reference" size="mini" type="success"
            >Créer une nouvelle liste de favoris</el-button
          >
        </el-popconfirm>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getCryptos,
  getAvailableCrypto,
  get_crypto_history,
} from "../../api/crypto";
import { update_user_fav } from "../../api/user";
import selectCurrency from "../selectCurrency.vue";
import { formatPrice } from "../../utils/format";

export default {
  components: {
    selectCurrency,
  },
  data() {
    return {
      cryptoList: [],
      multipleSelection: [],
      defaultCurrency: "EUR",
      isLoading: false,
      search: "",
      chartOptions: {
        chart: {
          type: "area",
          height: 350,
        },
        toolbar: {
          show: false,
          tools: {
            download: false,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        tooltip: {
          x: {
            format: "dd MMM yyyy",
          },
          fixed: {
            enabled: false,
            position: "topRight",
          },
        },
        fill: {
          opacity: 1,
          type: "gradient",
        },
        colors: ["#71A8FC"],
        xaxis: {
          type: "datetime",
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
        },
      },
      series: [],
    };
  },
  mounted() {},
  methods: {
    async getCryptoList(currency) {
      this.isLoading = true;
      this.defaultCurrency = currency;
      getAvailableCrypto()
        .then(({ data }) => {
          const availableCrypto = data.data.map((crypto) => {
            return crypto.id;
          });
          getCryptos(availableCrypto, [this.defaultCurrency])
            .then(({ data }) => {
              const crypto = data.data;
              this.cryptoList = Object.keys(crypto).map((key) => {
                return {
                  fullName: crypto[key].FullName,
                  imageUrl: crypto[key][currency].IMAGEURL,
                  price: formatPrice(crypto[key][currency].PRICE, currency),
                  volume24hours: formatPrice(
                    crypto[key][currency].VOLUME24HOUR,
                    currency
                  ),
                  supply: formatPrice(crypto[key][currency].SUPPLY, currency),
                  currency,
                  open24hour: formatPrice(
                    crypto[key][currency].OPEN24HOUR,
                    currency
                  ),
                  lastMarket: crypto[key][currency].LASTMARKET,
                  symbol: crypto[key][currency].FROMSYMBOL,
                  history: [],
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
          this.$toast.error("Une erreur est survenue");
        });

      // console.log(availableCrypto.data.data);
    },
    updateFav() {
      update_user_fav(this.multipleSelection)
        .then(() => {
          this.$toast.success("Favoris mis à jour");
          this.$emit("update:fav-list", this.multipleSelection);
          this.$refs.cryptoTable.clearSelection();
        })
        .catch((e) => {
          console.trace(e);
          this.$toast.error(e.message);
        });
    },
    handleSelectionChange(rows) {
      this.multipleSelection = [];

      if (rows) {
        rows.forEach((row) => {
          if (row) {
            this.multipleSelection.push(row.symbol);
          }
        });
      }
    },
    handleExpandChange(row) {
      get_crypto_history(row.symbol, "daily")
        .then(({ data }) => {
          console.log(row);
          const history = [];
          console.log(data);
          history.push({
            name: row.symbol,
            data: data.data.Data.map((item) => {
              return [item.time * 1000, item.close];
            }),
          });
          row.history = history;
        })
        .catch(() => {
          console.log("xxx-xxx-xxx");
          this.$refs.cryptoTable.toggleRowExpansion(row, false);
          this.$toast.error("Cette crypto n'a pas d'historique");
        });
    },
    getRowKeys(row) {
      return row.symbol;
    },
  },
};
</script>

<style>
.el-loading-spinner {
  display: flex;
  justify-content: center;
}

.el-input__inner {
  height: 30px;
}
.el-input--mini .el-input__inner {
  height: 30px;
}
.el-input__suffix {
  display: flex;
  align-items: center;
}
</style>
