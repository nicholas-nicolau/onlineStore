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
        <div class="firstOption">
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
        </div>
        <div class="secondOption">
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
          </p>
          <select></select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FilterJson from "@/services/FilterJson";
import ApiResources from "@/services/ApiResources";
export default {
  props: ["typeOfColision", "amountOfColision", "colisionArray"],
  methods: {
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
    getAllOthersCategories() {
      let apiResponse = FilterJson.getValue(
        ApiResources.getRequest("categories"),
        "data"
      );
      return (apiResponse = apiResponse.filter((element) => {
        element.name != false;
      }));
    },
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
  width: 40vw;
  height: 30vh;
  border: 0.5px solid lightgrey;
  border-radius: 15px;
  box-shadow: 5px 5px 5px grey;
  background-color: white;
}
</style>
