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
        <th v-if="hasImage == 'true'">Imagem</th>
        <th v-for="header in TableHeaders" :key="header">{{ header }}</th>
        <th>Ação</th>
      </tr>
      <tr
        v-for="product in filteredProducts"
        :key="product.ID"
        :id="product.ID"
      >
        <td v-if="'Imagem' in product">
          <img :src="product.Imagem" v-if="product.Imagem" />
          <img v-else src="../assets/defaultImage.png" />
        </td>
        <td v-for="typeOfHeader in TableHeaders" :key="typeOfHeader">
          {{ product[typeOfHeader] }}
        </td>
        <td :id="product.ID">
          <button :id="product.ID" @click="clickHandler">Editar</button>
        </td>
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
  props: [
    "captionText",
    "inputTextPathToFilter",
    "inputTextMethod",
    "requestType",
    "requestBasePath",
    "tableHeaders",
    "tableHeadersPaths",
    "filterByHighlight",
    "hasImage",
    "basePathEdit",
    "specialFilter",
    "specialFilterPath",
  ],
  data() {
    return {
      filteredProducts: "",
      products: "",
      InputTextPathToFilter: [],
      RequestBasePath: [],
      TableHeaders: [],
      TableHeadersPaths: [],
      productsString: "",
      productsArray: [],
      id: "",
    };
  },
  methods: {
    clickHandler(ev) {
      this.$router.push(
        `/${this.requestType}/${ev.target.attributes.id.value}/edit`
      );
    },
    getInputValue(event) {
      if (event.target.value != "") {
        this.filteredProducts = this.productsArray.filter((element) => {
          return FilterJson.filter(element, {
            path: this.InputTextPathToFilter,
            valueToFilter: event.target.value,
            method: this.inputTextMethod,
          });
        });
      } else {
        this.filteredProducts = this.productsArray;
      }
    },
  },
  async beforeMount() {
    //trasnforming parameters data
    this.InputTextPathToFilter = this.inputTextPathToFilter.split(",");
    this.RequestBasePath = this.requestBasePath.split(",");
    this.TableHeaders = this.tableHeaders.split(",");
    this.TableHeadersPaths = this.tableHeadersPaths.split(",");
    //getting array from response
    this.products = FilterJson.getValue(
      await ApiResources.getRequest(this.requestType),
      this.RequestBasePath
    );
    //filtering array and transforming structure according to TableHeadersPaths provided
    if (this.filterByHighlight == "true") {
      this.products = this.products.filter((element) => {
        return FilterJson.filter(element, {
          path: ["attributes", "highlight"],
          valueToFilter: true,
          method: "equals",
        });
      });
    }
    //filtering by the special filter
    if (this.specialFilter != undefined) {
      this.products = this.products.filter((element) => {
        return FilterJson.filter(element, {
          path: this.specialFilterPath,
          valueToFilter: this.specialFilter,
          method: "contains",
        });
      });
    }
    //adjusting product objects inside array to display, order to evaluate: headers of the table
    this.products.forEach((product) => {
      this.objectsString = new Object();
      this.TableHeaders.forEach((headerName, headerIndex) => {
        this.objectsString[headerName] = FilterJson.getValue(
          product,
          this.TableHeadersPaths[headerIndex]
        );
      });
      this.productsArray.push(this.objectsString);
    });
    //seting array to be displayed
    this.filteredProducts = this.productsArray;
    //removing special headers
    this.TableHeaders = this.TableHeaders.filter((element) => {
      if (element.toLowerCase() == "imagem") return false;
      if (element.toLowerCase() == "id" && this.requestType == "products")
        return false;
      return true;
    });
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
  overflow-y: auto;
}

th {
  font-size: 18px;
  background-color: darkgrey;
  height: 30px;
  color: black;
  padding-left: 20px;
  padding-right: 20px;
}
tr:nth-child(2n + 1) {
  background-color: lightgrey;
}
td {
  padding: 0 5px;
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

button {
  margin: 5px 0px;
  width: 60px;
  height: 25px;
  outline: none;
  background-color: grey;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  font-size: 15px;
  font-family: sans-serif;
}

button:hover {
  cursor: pointer;
}
</style>
