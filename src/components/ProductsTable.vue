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
        <th v-if="colisionType == undefined">Ação</th>
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
          <select
            v-if="typeOfHeader == optionHeaderName && colisionType != undefined"
            @change="selectHandler"
            :id="product.ID"
          >
            <option selected disabled hidden></option>
            <option v-for="option in allOtherOptions" :key="option">
              {{ option.name }}
            </option>
          </select>
          <p v-else>
            {{ product[typeOfHeader] }}
          </p>
        </td>
        <td :id="product.ID">
          <button
            v-if="colisionType == undefined"
            :id="product.ID"
            @click="clickHandler"
          >
            Editar
          </button>
        </td>
      </tr>
      <td colspan="7" v-if="filteredProducts.length == 0">
        <p class="nothingFound">Nada foi encontrado :/</p>
      </td>
    </table>
    <div class="button">
      <button
        @click="confirmColisionChanges"
        v-if="colisionType != undefined"
        style="
          background-color: green;
          width: 250px;
          height: 40px;
          font-size: 22px;
          margin-top: 20px;
        "
      >
        Confirmar
      </button>
    </div>
  </div>
</template>

<script>
import ApiResources from "../services/ApiResources.js";
import FilterJson from "@/services/FilterJson";
import Utils from "../services/Utils.js";

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
    "specialFilterMethod",
    "colisionType",
    "colisionName",
  ],
  data() {
    return {
      filteredProducts: "",
      products: "",
      TableHeaders: [],
      TableHeadersPaths: [],
      productsString: "",
      productsArray: [],
      id: "",
      SpecialFilter: [],
      SpecialFilterPath: [],
      SpecialFilterMethod: [],
      allOtherOptions: [],
      optionHeaderName: "",
      optionsValidation: [],
      validationObject: {},
      colisionOriginalOptionId: "",
    };
  },
  methods: {
    async confirmColisionChanges() {
      if (Object.keys(this.validationObject).length != this.products.length) {
        window.alert("Por favor, altere todos os produtos na lista!!");
        return;
      }
      await Utils.updatingProducts(
        this.validationObject,
        this.colisionType,
        this.colisionOriginalOptionId
      );
      this.$router.push(`/${this.$route.params.typeOfColision}`);
    },
    selectHandler(ev) {
      let currentOption = this.allOtherOptions.filter((option) => {
        return ev.target.value == option.name;
      });
      this.validationObject[ev.target.attributes.id.value] =
        currentOption[0].id;
    },
    clickHandler(ev) {
      this.$router.push(
        `/${this.requestType}/${ev.target.attributes.id.value}/edit`
      );
    },
    getInputValue(event) {
      if (event.target.value != "") {
        this.filteredProducts = this.productsArray.filter((element) => {
          return FilterJson.filter(element, {
            path: this.inputTextPathToFilter,
            valueToFilter: event.target.value,
            method: this.inputTextMethod,
          });
        });
      } else {
        this.filteredProducts = this.productsArray;
      }
    },
    nameRelationship(name) {
      let names = {
        categories: "Categoria",
        measures: "Un",
      };
      return names[name];
    },
  },
  async beforeMount() {
    //trasnforming parameters data
    this.TableHeaders = this.tableHeaders.split(",");
    this.TableHeadersPaths = this.tableHeadersPaths.split(",");
    //getting array from response
    this.products = FilterJson.getValue(
      await ApiResources.getRequest(this.requestType),
      this.requestBasePath
    );
    //filtering by the special filter
    if (this.specialFilter != undefined) {
      //settinda data for special filter
      this.SpecialFilter = this.specialFilter.split(",");
      this.SpecialFilterPath = this.specialFilterPath.split(",");
      this.SpecialFilterMethod = this.specialFilterMethod.split(",");
      //filtering
      this.SpecialFilter.forEach((specialFilter, index) => {
        this.products = this.products.filter((product) => {
          console.log(product);
          return FilterJson.filter(product, {
            path: this.SpecialFilterPath[index],
            valueToFilter: specialFilter,
            method: this.SpecialFilterMethod[index],
          });
        });
      });
    }
    //adjusting product objects inside array to display
    //Order to evaluate: headers of the table
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
    //setting colision options
    if (this.colisionType != undefined) {
      this.optionHeaderName = this.nameRelationship(this.colisionType);
      this.allOtherOptions = FilterJson.getValue(
        await ApiResources.getRequest(this.colisionType),
        "data"
      );
      this.allOtherOptions = this.allOtherOptions.filter((element) => {
        element.name == this.colisionName
          ? (this.colisionOriginalOptionId = element.id)
          : "";
        return element.name != this.colisionName;
      });
    }
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

select {
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-family: sans-serif;
  background-color: rgba(0, 0, 0, 0);
  outline: none;
}
</style>
