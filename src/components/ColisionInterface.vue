<template>
  <div class="container-colision">
    <div class="alert">
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
                  ? "todos os produtos com a categoria '" +
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
        <div class="secondOption option" v-if="allOthersCategories.length > 0">
          <p>
            {{
              `Substituir a categoria ${
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
            <select v-model="selectCategoryName">
              <option v-for="category in allOthersCategories" :key="category">
                {{ category.name }}
              </option>
            </select>
          </p>
          <button @click="changeAllProducts">Confirmar</button>
        </div>
        <div class="option" v-if="amountOfColision > 1">
          <p>Decidir manualmente a cada produto</p>
          <button>Confirmar</button>
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
  props: ["typeOfColision", "amountOfColision", "colisionArray"],
  data() {
    return {
      allOthersCategories: [],
      product: {},
      selectCategoryName: "",
      originalCategoryId: "",
    };
  },
  methods: {
    cancel() {
      this.$emit("canceled", true);
    },
    async deleteAllProducts() {
      let responses = this.colisionArray.map(async (element) => {
        await ApiResources.deleteRequest(`products/${element.id}`);
      });
      await Promise.all(responses);
      await ApiResources.deleteRequest(`categories/${this.originalCategoryId}`);
      window.alert(
        `${
          this.colisionArray.length > 1
            ? "Produtos e categoria excluídos com sucesso!"
            : "Produto e categoria excluídos com sucesso!"
        }`
      );
      this.$router.push("/categories");
    },
    nameCategoryToIdCategory() {
      if (this.selectCategoryName.length == 0)
        window.alert("por favor, selecione ao menos uma categoria");
      if (this.selectCategoryName.length > 0) {
        return this.allOthersCategories.filter(
          (category) => category.name == this.selectCategoryName
        )[0].id;
      }
    },
    async changeAllProducts() {
      let newCategoryId = this.nameCategoryToIdCategory;
      let responses = this.colisionArray.map(async (element) => {
        this.product = {
          name: element.attributes.name,
          category_id: newCategoryId(),
          measure_id: element.attributes["measure-id"],
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
      await ApiResources.deleteRequest(`categories/${this.originalCategoryId}`);
      window.alert(
        `${
          this.colisionArray.length > 1
            ? "Produtos atualizados e categoria excluída com sucesso!"
            : "Produto atualizado e categoria excluída com sucesso!"
        }`
      );
      this.$router.push("/categories");
    },
    getNameFromObject(object, path) {
      return FilterJson.getValue(object, path);
    },
    nameRelationship(value) {
      let relation = {
        category: "categoria",
        measure: "unidade de medida",
      };
      return relation[value];
    },
  },
  async beforeCreate() {
    let currentCategoryName =
      this.colisionArray[0].relationships.category.data.name;
    let apiResponse = await FilterJson.getValue(
      await ApiResources.getRequest("categories"),
      "data"
    );
    this.allOthersCategories = apiResponse = apiResponse.filter((element) => {
      if (element.name == currentCategoryName) {
        this.originalCategoryId = element.id;
      }
      return element.name != currentCategoryName;
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
