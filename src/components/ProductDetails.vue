<template>
  <div class="container">
    <h3>
      {{
        this.$route.params.productId
          ? "Detalhes do Produto"
          : "Cadastrar novo produto"
      }}
    </h3>
    <form>
      <label for="name">Nome</label>
      <input
        @change="changeHdl"
        type="text"
        placeholder="Nome"
        id="name"
        :value="apiResponse.attributes ? apiResponse.attributes.name : ''"
      />
      <label for="details">Detalhes</label>
      <textarea
        @change="changeHdl"
        type="text"
        placeholder="Detalhes"
        id="details"
        :value="apiResponse.attributes ? apiResponse.attributes.details : ''"
      />
      <label for="stock">Estoque</label>
      <input
        @change="changeHdl"
        :value="apiResponse.attributes ? apiResponse.attributes.stock : ''"
        type="number"
        placeholder="Estoque"
        id="stock"
        step="1"
        min="0"
      />
      <label for="value">Preço</label>
      <input
        @change="changeHdl"
        :value="apiResponse.attributes ? apiResponse.attributes.value : ''"
        type="number"
        placeholder="Preço"
        id="value"
        min="0"
      />
      <label for="image">Imagem</label>
      <input
        @change="changeHdl"
        style="border: none"
        type="file"
        id="image"
        placeholder="Escolher imagem"
      />

      <div class="smallOptionsWrapper">
        <div class="smallOptions">
          <label for="category_id">Categoria</label>
          <select
            @change="changeHdl"
            id="category_id"
            :value="
              apiResponse.relationships
                ? apiResponse.relationships.category.data.name
                : ''
            "
          >
            <option v-for="categorie in categories" :key="categorie">
              {{ categorie.name }}
            </option>
          </select>
        </div>
        <div class="smallOptions">
          <label for="measure_id">Unidade</label>
          <select
            @change="changeHdl"
            id="measure_id"
            :value="
              apiResponse.relationships
                ? apiResponse.relationships.measure.data.name
                : ''
            "
          >
            <option v-for="measure in measures" :key="measure">
              {{ measure.name }}
            </option>
          </select>
        </div>
        <div class="smallOptions">
          <label for="highlight">Destaque</label>
          <input
            v-if="highlightState"
            @change="changeHdl"
            id="highlight"
            style="width: 22px; min-width: 10px"
            type="checkbox"
            checked
          />
          <input
            v-else
            @change="changeHdl"
            id="highlight"
            style="width: 22px; min-width: 10px"
            type="checkbox"
          />
        </div>
      </div>
    </form>
    <div class="buttons">
      <button style="background-color: green" @click="clickHdl">Salvar</button>
      <button v-if="this.$route.params.productId" @click="deleteObject">
        Excluir
      </button>
      <button v-else style="background-color: orange" @click="returnToProducts">
        Cancelar
      </button>
    </div>
  </div>
</template>

<script>
import ApiResources from "@/services/ApiResources";
import FilterJson from "@/services/FilterJson";

export default {
  data() {
    return {
      apiResponse: {},
      categories: {},
      measures: {},
      highlightState: "",
      product: {},
      changeStatus: false,
      formData: "",
      file: "",
    };
  },
  methods: {
    clickHdl() {
      this.$route.params.productId != undefined
        ? this.updateObject()
        : this.createObject();
    },
    async deleteObject() {
      let responseStatus = await ApiResources.deleteRequest(
        `products/${this.$route.params.productId}`
      );
      if (responseStatus.status == 204) {
        window.alert("Produto deletado com sucesso!!");
        this.$router.push("/products");
      } else {
        window.alert("Algo deu errado...");
      }
    },
    async updateObject() {
      if (this.changeStatus == false) {
        window.alert("não há nada para atualizar...");
        return;
      }
      let responseStatus = await ApiResources.patchRequest(
        `products/${this.$route.params.productId}`,
        "product",
        this.product
      );
      if (responseStatus.status == 200) {
        window.alert("Produto atualizado com sucesso!!");
        this.$router.push("/products");
      } else {
        window.alert("Algo deu errado...");
      }
    },
    async createObject() {
      console.log("entrou para criar");
      let responseStatus = await ApiResources.postRequest(
        `products`,
        "product",
        this.product
      );
      if (responseStatus.status == 201) {
        window.alert("Produto criado com sucesso!!");
        this.$router.push("/products");
      } else {
        window.alert("Algo deu errado...");
      }
    },
    changeHdl(ev) {
      this.changeStatus = true;
      switch (ev.target.attributes.id.value) {
        case "category_id":
          this.product[ev.target.attributes.id.value] = this.translateNameToId(
            ev.currentTarget.value,
            "category"
          );
          break;
        case "measure_id":
          this.product[ev.target.attributes.id.value] = this.translateNameToId(
            ev.currentTarget.value,
            "measure"
          );
          break;
        case "highlight":
          this.product[ev.target.attributes.id.value] = ev.target.checked;
          break;
        case "image":
          this.formData = new FormData();
          this.file = ev.target.files[0];
          this.formData.append("image", this.file, this.file.name);
          this.product["image"] = {};
          break;
        default:
          this.product[ev.target.attributes.id.value] = ev.currentTarget.value;
          break;
      }
    },
    translateNameToId(name, type) {
      switch (type) {
        case "measure":
          this.measures.forEach((measure) => {
            if (name == measure.name) {
              name = measure.id;
              return;
            }
          });
          break;
        case "category":
          this.categories.forEach((category) => {
            if (name == category.name) {
              name = category.id;
              return;
            }
          });
          break;
      }
      return name;
    },
    returnToProducts() {
      this.$router.push("/products");
    },
  },
  async beforeCreate() {
    if (this.$route.params.productId > 0) {
      this.apiResponse = await FilterJson.getValue(
        await ApiResources.getRequest(
          `products/${this.$route.params.productId}`
        ),
        "data.data"
      );
      this.highlightState = this.apiResponse.attributes.highlight;
      this.product = {
        name: this.apiResponse.attributes.name,
        category_id: this.apiResponse.attributes["category-id"],
        measure_id: this.apiResponse.attributes["measure-id"],
        stock: this.apiResponse.attributes.stock,
        value: this.apiResponse.attributes.value,
        highlight: this.apiResponse.attributes.highlight,
        details: this.apiResponse.attributes.details,
      };
    }
    this.categories = await FilterJson.getValue(
      await ApiResources.getRequest(`categories`),
      "data"
    );
    this.measures = await FilterJson.getValue(
      await ApiResources.getRequest(`measures`),
      "data"
    );
  },
};
</script>

<style scoped>
.container {
  box-sizing: border-box;
  width: 70%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  border: 1px solid lightgrey;
  border-radius: 15px;
  margin-right: 10px;
  margin-top: 15px;
  box-shadow: 5px 5px 5px grey;
  max-height: 90%;
  overflow: auto;
}

form {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: flex-start;
}

input,
textarea {
  width: 100%;
  min-width: 100%;
  max-width: 100%;
  outline: none;
  height: 30px;
  border: 1px solid darkgrey;
  border-radius: 5px;
  padding-left: 5px;
  font-size: 15px;
  font-family: sans-serif;
  margin-left: 5px;
}

label {
  font-weight: bold;
  margin-top: 8px;
  margin-bottom: 2px;
}

.smallOptions,
.smallOptionsWrapper {
  display: flex;
  align-items: center;
}

.smallOptionsWrapper {
  width: 100%;
  justify-content: space-around;
}

button {
  width: 200px;
  height: 30px;
  outline: none;
  background-color: red;
  border: none;
  border-radius: 7px;
  font-weight: bold;
  font-size: 20px;
  font-family: sans-serif;
}

button:hover {
  cursor: pointer;
}

.buttons {
  display: flex;
  justify-content: space-around;
  width: 66%;
  margin-left: 17%;
  margin-top: 50px;
}
</style>
