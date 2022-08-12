<template>
  <div class="container">
    <h3>
      {{
        this.$route.params.categoryId
          ? "Detalhes da Categoria"
          : "Cadastrar nova categoria"
      }}
    </h3>
    <form>
      <label for="nome">Nome</label>
      <input
        id="nome"
        type="text"
        :value="apiResponse ? apiResponse.name : ''"
        @change="changeHdl"
      />
    </form>
    <div class="buttons">
      <button style="background-color: green" @click="clickHdl">Salvar</button>
      <button v-if="this.$route.params.categoryId" @click="checkForColision">
        Excluir
      </button>
      <button
        v-else
        style="background-color: orange"
        @click="returnToCategories"
      >
        Cancelar
      </button>
    </div>
  </div>
  <colision-interface
    v-if="this.colisions.length > 0"
    type-of-colision="category"
    :name-of-colision="apiResponse ? apiResponse.name : ''"
    :amount-of-colision="this.colisions.length"
    :colision-array="this.colisions"
    @canceled="canceledClick"
  ></colision-interface>
</template>

<script>
import ApiResources from "@/services/ApiResources";
import FilterJson from "@/services/FilterJson";
import Utils from "@/services/Utils";
import ColisionInterface from "../components/ColisionInterface.vue";

export default {
  data() {
    return {
      apiResponse: {},
      colisions: [],
    };
  },
  components: {
    ColisionInterface,
  },
  methods: {
    canceledClick() {
      this.colisions = [];
    },
    clickHdl() {
      this.$route.params.categoryId != undefined
        ? this.updateObject()
        : this.createObject();
    },
    returnToCategories() {
      this.$router.push("/categories");
    },
    async checkForColision() {
      this.colisions = await Utils.checkingForColisions(
        "categories",
        this.$route.params.categoryId
      );
      if (this.colisions.length == 0) this.deleteObject();
    },
    async deleteObject() {
      let responseStatus = await ApiResources.deleteRequest(
        `categories/${this.$route.params.categoryId}`
      );
      if (responseStatus.status == 204) {
        window.alert("Categoria deletada com sucesso!!");
        this.$router.push("/categories");
      } else {
        window.alert("Algo deu errado...");
      }
    },
    async updateObject() {
      if (!this.changeStatus) {
        window.alert("não há nada para atualizar...");
        return;
      }
      this.apiResponse = await ApiResources.patchRequest(
        `measures/${this.$route.params.measureId}`,
        "measure",
        { name: this.updatedName }
      );
      if (this.apiResponse.status == 200) {
        window.alert("Unidade de medida atualizada com sucesso!!");
        this.$router.push("/measures");
      } else {
        window.alert("Algo deu errado...");
      }
    },
    async createObject() {
      console.log({ name: this.updatedName });
      let responseStatus = await ApiResources.postRequest(
        `categories`,
        "category",
        { name: this.updatedName }
      );
      if (responseStatus.status == 201) {
        window.alert("Categoria criada com sucesso!!");
        this.$router.push("/categories");
      } else {
        window.alert("Algo deu errado...");
      }
    },
    changeHdl(ev) {
      this.changeStatus = true;
      this.updatedName = ev.currentTarget.value;
    },
  },
  async beforeCreate() {
    if (this.$route.params.categoryId > 0) {
      this.apiResponse = await FilterJson.getValue(
        await ApiResources.getRequest(
          `categories/${this.$route.params.categoryId}`
        ),
        "data"
      );
    }
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
