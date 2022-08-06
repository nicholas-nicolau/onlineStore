<template>
  <div class="container">
    <div class="text">
      <h3>{{ captionText }}</h3>
      <div class="searchField">
        <input type="text" placeholder="Procurar" @keyup="getInputValue" />
      </div>
    </div>

    <table>
      <tr>
        <th>Imagem</th>
        <th>Nome</th>
        <th>Detalhes</th>
        <th>Categoria</th>
        <th>Un</th>
        <th>Estoque</th>
        <th>Valor</th>
      </tr>
      <tr v-for="product in filteredProducts" :key="product.attributes.name">
        <td><img :src="product.attributes['image-url']" /></td>
        <td>{{ product.attributes.name }}</td>
        <td style="max-width: 250px">
          {{
            product.attributes.details == null
              ? "-"
              : product.attributes.details
          }}
        </td>
        <td>{{ product.relationships.category.data.name }}</td>
        <td>{{ product.relationships.measure.data.name }}</td>
        <td>{{ product.attributes.stock }}</td>
        <td>{{ product.attributes.value }}</td>
      </tr>
      <td colspan="7" v-if="filteredProducts.length == 0">
        <p class="nothingFound">Nothing were found :/</p>
      </td>
    </table>
  </div>
</template>

<script>
import ApiResources from "../services/ApiResources.js";
import FilterJson from "@/services/FilterJson";

export default {
  props: ["captionText"],
  data() {
    return {
      filteredProducts: "",
      products: "",
    };
  },
  methods: {
    getInputValue(event) {
      if (event.target.value != "") {
        this.filteredProducts = this.products.filter((element) => {
          return FilterJson.filter(element, {
            path: ["attributes", "name"],
            valueToFilter: event.target.value,
            method: "contains",
          });
        });
      } else {
        this.filteredProducts = this.products;
      }
    },
  },
  async beforeMount() {
    //getting array from response
    this.products = FilterJson.getValue(
      await ApiResources.getRequest("products"),
      ["data", "data"]
    );
    //filtering array
    this.products = this.products.filter((element) => {
      return FilterJson.filter(element, {
        path: ["attributes", "highlight"],
        valueToFilter: true,
        method: "equals",
      });
    });
    this.filteredProducts = this.products;
  },
};
</script>

<style scoped>
.container {
  box-sizing: border-box;
  width: 95%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  border: 1px solid lightgrey;
  border-radius: 15px;
  margin-right: 10px;
  margin-top: 15px;
  box-shadow: 5px 5px 5px grey;
}
.searchField {
  display: flex;
  justify-content: baseline;
  justify-content: end;
}

h3 {
  text-align: left;
  color: black;
}
input {
  outline: none;
  width: 300px;
  height: 30px;
  font-size: 15px;
  padding-left: 5px;
  border-radius: 4px;
  border: 0.5px solid lightgrey;
}
table {
  margin-top: 10px;
  border-collapse: collapse;
}

th {
  font-size: 18px;
  background-color: darkgrey;
  height: 30px;
  color: black;
}
tr:nth-child(2n + 1) {
  background-color: lightgrey;
}

img {
  width: 70px;
  height: 70px;
  margin: 5px;
}

.nothingFound {
  font-weight: bold;
  color: black;
  font-size: 20px;
  margin: 10px;
}
</style>
