<template>
  <div>
    <div id="buttons-space">
      <button
        class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        @click="onDelete()"
      >
        Delete
      </button>
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        @click="onClickAddButton()"
      >
        Add
      </button>
    </div>
    <table class="table-auto w-full">
      <thead class="bg-gray-50">
        <tr class="text-xs text-gray-500 text-left">
          <th class="flex items-center pl-6 py-4 font-medium">
            <span>Coin</span>
          </th>
          <th class="py-4 font-medium">Price</th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="border-b border-blue-50"
          v-for="(crypto, index) in cryptos"
          :key="index"
        >
          <td class="flex items-center py-4 px-6 font-medium">
            <input
              type="checkbox"
              name=""
              id=""
              class="mr-3"
              v-model="crypto.isSelected"
            />
            <div class="flex px-4 py-3">
              <img
                :src="'https://www.cryptocompare.com/' + crypto.IMAGEURL"
                alt=""
                class="w-8 h-8 mr-4 object-cover rounded-md"
              />
              <div>
                <p class="text-sm font-medium">{{ crypto.full_name }}</p>
                <p class="text-xs text-gray-500">{{ crypto.id }}</p>
              </div>
            </div>
          </td>
          <td class="font-medium">
            <p class="text-sm font-medium">{{ crypto.PRICE }}€</p>
          </td>
        </tr>
      </tbody>
    </table>
    <Modal ref="modal">
      <h1 slot="title">Add crypto</h1>
      <div slot="content">
        <select
          ref="select"
          v-if="cryptoCompareCryptos"
          class="form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
        >
          <option selected disabled>Please select a coin</option>
          <option
            v-for="(crypto, index) in cryptoCompareCryptos"
            :key="index"
            :value="crypto.symbol"
          >
            {{ crypto.symbol }}
          </option>
          <option value="BTC">Bitcoin</option>
          <option value="ETH">Ethereum</option>
          <option value="BNB">Binance coin</option>
          <option value="USDC">USD coin</option>
          <option value="PMON">Polychain Monster</option>
        </select>
      </div>
      <div slot="confirm-button" @click="onAdd">Add</div>
    </Modal>
  </div>
</template>

<script>
import {
  addCrypto,
  getCryptos,
  getAllCryptos,
  deleteCrypto,
  getAllCryptoCompareCryptos,
} from "../../../api/admin/cryptos";

import Modal from "./Modal.vue";

export default {
  name: "CryptoTable",
  components: { Modal },
  data() {
    return {
      cryptos: [],
      cryptoCompareCryptos: [],
      showModal: true,
    };
  },
  async mounted() {
    this.initTable();
    this.cryptoCompareCryptos = await getAllCryptoCompareCryptos().then(
      (response) => {
        return response.data.Data;
      }
    );
  },
  methods: {
    async initTable() {
      let cryptos = await getAllCryptos().then((response) => {
        return response.data.data;
      });
      for (const [index, c] of Object.entries(cryptos)) {
        let c2 = await getCryptos([c.id]).then((response) => {
          return response.data.data;
        });
        cryptos[index] = { ...cryptos[index], ...c2[c.id].EUR };
      }
      this.cryptos = cryptos;
    },
    onClickAddButton() {
      this.$refs.modal.toggleModal();
    },
    async onAdd() {
      let cryptoName = this.$refs.select.value;
      let cryptoFullName =
        this.$refs.select.options[this.$refs.select.selectedIndex].text;
      await addCrypto(cryptoName, cryptoFullName)
        .then(() => {
          this.$swal.fire(
            "Added!",
            "You well added " + cryptoFullName,
            "success"
          );
        })
        .catch((e) => {
          console.log(e);
          this.$swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
        });
      this.initTable();
    },
    onDelete() {
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
            let cryptos = [];
            for (const [, c] of Object.entries(this.cryptos))
              if (c.isSelected === true) cryptos.push(c.id);
            for (const c of cryptos) await deleteCrypto(c);
            this.$swal.fire(
              "Deleted!",
              "Your cryptos have been deleted.",
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
