<template>
  <div class="container">
    <h3>
      {{
        this.$route.params.measureId
          ? "Detalhes da Unidade de Medida"
          : "Cadastrar nova Unidade de Medida"
      }}
    </h3>
    <form>
      <label for="nome">Nome</label>
      <input
        @change="changeHdl"
        id="nome"
        type="text"
        :value="apiResponse ? apiResponse.name : ''"
      />
    </form>
    <div class="buttons">
      <button style="background-color: green" @click="clickHdl">Salvar</button>
      <button v-if="this.$route.params.measureId" @click="checkForColision">
        Excluir
      </button>
      <button v-else style="background-color: orange" @click="returnToMeasures">
        Cancelar
      </button>
    </div>
  </div>
  <colision-interface
    v-if="this.colisions.length > 0"
    type-of-colision="measure"
    :name-of-colision="apiResponse ? apiResponse.name : ''"
    :amount-of-colision="this.colisions.length"
    :colision-array="this.colisions"
    @canceled="canceledClick"
  ></colision-interface>
</template>

<script>
import ApiResources from "@/services/ApiResources";
import FilterJson from "@/services/FilterJson";
import ColisionInterface from "../components/ColisionInterface.vue";
import Utils from "../services/Utils.js";

export default {
  data() {
    return {
      apiResponse: {},
      changeStatus: false,
      updatedName: "",
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
    async checkForColision() {
      this.colisions = await Utils.checkingForColisions(
        "measures",
        this.$route.params.measureId
      );
      if (this.colisions.length == 0) this.deleteObject();
    },
    clickHdl() {
      this.$route.params.measureId != undefined
        ? this.updateObject()
        : this.createObject();
    },
    async deleteObject() {
      let responseStatus = await ApiResources.deleteRequest(
        `measures/${this.$route.params.measureId}`
      );
      if (responseStatus.status == 204) {
        window.alert("Unidade de medida deletada com sucesso!!");
        this.$router.push("/measures");
      } else {
        window.alert("Algo deu errado...");
      }
    },
    returnToMeasures() {
      this.$router.push("/measures");
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
      let responseStatus = await ApiResources.postRequest(
        `measures`,
        "measure",
        { name: this.updatedName }
      );
      if (responseStatus.status == 201) {
        window.alert("Unidade de medida criada com sucesso!!");
        this.$router.push("/measures");
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
    if (this.$route.params.measureId > 0) {
      this.apiResponse = await FilterJson.getValue(
        await ApiResources.getRequest(
          `measures/${this.$route.params.measureId}`
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
