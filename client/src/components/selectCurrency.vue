<template>
  <el-select v-model="currencyValue" filterable placeholder="Votre devise">
    <el-option
      v-for="currency in currencyList"
      :key="currency.value"
      :label="currency.name"
      :value="currency.value"
    >
    </el-option>
  </el-select>
</template>

<script>
import currencies from "../utils/currencies";
export default {
  data() {
    return {
      currencyValue: "EUR",
    };
  },
  mounted() {
    this.$emit("update:currency", this.currencyValue);
  },
  computed: {
    currencyList() {
      return currencies;
    },
  },
  watch: {
    currencyValue(value) {
      this.$emit("update:currency", value);
    },
  },
};
</script>
