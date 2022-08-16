<template>
  <div class="container-colision" @click="cancel">
    <div class="alert" @click.stop>
      <h3>
        {{
          `Há ${amountOfColision} ${
            amountOfColision > 1 ? "produtos" : "produto"
          } que contém essa ${nameRelationship(
            typeOfColision
          )}, como deseja prosseguir?`
        }}
      </h3>
      <div class="options">
        <div class="firstOption option">
          <p>
            {{
              `Excluir ${
                amountOfColision > 1
                  ? `todos os produtos com a ${this.nameRelationship(
                      this.typeOfColision
                    )} '` +
                    getNameFromObject(
                      this.colisionArray[0],
                      `relationships.${typeOfColision}.data.name`
                    ) +
                    "'"
                  : "o produto '" +
                    getNameFromObject(
                      this.colisionArray[0],
                      "attributes.name"
                    ) +
                    "'"
              }`
            }}
          </p>
          <button @click="deleteAllProducts()">Confirmar</button>
        </div>
        <div class="secondOption option" v-if="allOthersOptions.length > 0">
          <p>
            {{
              `Substituir a ${this.nameRelationship(this.typeOfColision)} ${
                amountOfColision > 1
                  ? "dos produtos para: "
                  : "do produto '" +
                    getNameFromObject(
                      this.colisionArray[0],
                      "attributes.name"
                    ) +
                    "' para: "
              }`
            }}
            <select v-model="selectOptionName">
              <option v-for="option in allOthersOptions" :key="option">
                {{ option.name }}
              </option>
            </select>
          </p>
          <button @click="changeAllProducts">Confirmar</button>
        </div>
        <div class="option" v-if="amountOfColision > 1 && amountOfOptions > 2">
          <p>Decidir manualmente a cada produto</p>
          <button @click="goToTable">Confirmar</button>
        </div>
      </div>
      <button
        style="margin: 15px; background-color: orange; width: 200px"
        @click="cancel"
      >
        Cancelar
      </button>
    </div>
  </div>
</template>

<script>
import FilterJson from "@/services/FilterJson";
import ApiResources from "@/services/ApiResources";
export default {
  props: [
    "typeOfColision",
    "amountOfColision",
    "colisionArray",
    "nameOfColision",
  ],
  data() {
    return {
      allOthersOptions: [],
      product: {},
      selectOptionName: "",
      originalOptionId: "",
      amountOfOptions: "",
    };
  },
  methods: {
    cancel() {
      this.$emit("canceled", true);
    },
    goToTable() {
      this.$router.push(
        `/${this.nameRelationship(this.typeOfColision + "url")}/colision/${
          this.nameOfColision
        }`
      );
    },
    async deleteAllProducts() {
      let responses = this.colisionArray.map(async (element) => {
        await ApiResources.deleteRequest(`products/${element.id}`);
      });
      await Promise.all(responses);
      await ApiResources.deleteRequest(
        `${this.nameRelationship(this.typeOfColision + "url")}/${
          this.originalOptionId
        }`
      );
      window.alert(
        `${
          this.colisionArray.length > 1
            ? `Produtos e ${this.nameRelationship(
                this.typeOfColision
              )} excluídos com sucesso!`
            : `Produto e ${this.nameRelationship(
                this.typeOfColision
              )} excluídos com sucesso!`
        }`
      );
      this.$router.push(
        `/${this.nameRelationship(this.typeOfColision + "url")}`
      );
    },
    nameOptionToIdOption() {
      if (this.selectOptionName.length == 0)
        window.alert("por favor, selecione ao menos uma opção");
      if (this.selectOptionName.length > 0) {
        return this.allOthersOptions.filter(
          (option) => option.name == this.selectOptionName
        )[0].id;
      }
    },
    async changeAllProducts() {
      let newOptionId = this.nameOptionToIdOption;
      let responses = this.colisionArray.map(async (element) => {
        this.product = {
          name: element.attributes.name,
          category_id:
            this.typeOfColision == "category"
              ? newOptionId()
              : element.attributes["category-id"],
          measure_id:
            this.typeOfColision == "measure"
              ? newOptionId()
              : element.attributes["measure-id"],
          stock: element.attributes.stock,
          value: element.attributes.value,
          highlight: element.attributes.highlight,
          details: element.attributes.details,
        };
        await ApiResources.patchRequest(
          `products/${element.id}`,
          "product",
          this.product
        );
      });
      await Promise.all(responses);
      await ApiResources.deleteRequest(
        `${this.nameRelationship(this.typeOfColision + "url")}/${
          this.originalOptionId
        }`
      );
      window.alert(
        `${
          this.colisionArray.length > 1
            ? `Produtos atualizados e ${this.nameRelationship(
                this.typeOfColision
              )} excluída com sucesso!`
            : `Produto atualizado e ${this.nameRelationship(
                this.typeOfColision
              )} excluída com sucesso!`
        }`
      );
      this.$router.push(
        `/${this.nameRelationship(this.typeOfColision + "url")}`
      );
    },
    getNameFromObject(object, path) {
      return FilterJson.getValue(object, path);
    },
    nameRelationship(value) {
      let relation = {
        category: "categoria",
        measure: "unidade de medida",
        categoryurl: "categories",
        measureurl: "measures",
      };
      return relation[value];
    },
  },
  async beforeCreate() {
    let relation = {
      category: "categoria",
      measure: "unidade de medida",
      categoryurl: "categories",
      measureurl: "measures",
    };
    let requisitionName = relation[this.typeOfColision + "url"];
    let currentOptionName =
      this.colisionArray[0].relationships[this.typeOfColision].data.name;
    let apiResponse = await FilterJson.getValue(
      await ApiResources.getRequest(requisitionName),
      "data"
    );
    this.amountOfOptions = apiResponse.length;
    this.allOthersOptions = apiResponse.filter((element) => {
      if (element.name == currentOptionName) {
        this.originalOptionId = element.id;
      }
      return element.name != currentOptionName;
    });
  },
};
</script>
<style scoped>
.container-colision {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.alert {
  padding: 10px;
  width: 60vw;
  height: auto;
  border: 0.5px solid lightgrey;
  border-radius: 15px;
  box-shadow: 5px 5px 5px grey;
  background-color: white;
}

.option {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  margin: 5px 25px;
}

button {
  outline: none;
  border-radius: 5px;
  background-color: green;
  font-size: 15px;
  font-family: sans-serif;
  color: white;
  border: none;
  height: 30px;
  width: 75px;
}

button:hover {
  cursor: pointer;
}

select {
  border: none;
  font-size: 15px;
  width: auto;
  outline: none;
}

h3 {
  margin: 10px 5px 30px 5px;
}
</style>
