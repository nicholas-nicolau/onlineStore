<template>
  <div class="container">
    <div class="navegation">
      <side-bar></side-bar>
    </div>
    <section class="content">
      <top-bar
        :caption-name="
          nameRelationships(this.$route.params.typeOfColision + 'TopBar')
        "
      ></top-bar>
      <section class="table">
        <products-table
          :caption-text="`Listagem de Produtos com ${nameRelationships(
            this.$route.params.typeOfColision
          )} '${this.$route.params.colisionName}'`"
          input-text-path-to-filter="Nome"
          input-text-method="contains"
          request-type="products"
          request-base-path="data.data"
          table-headers="Imagem,Nome,Detalhes,Categoria,Un,Estoque,Valor,ID"
          table-headers-paths="attributes.image-url,attributes.name,attributes.details,relationships.category.data.name,relationships.measure.data.name,attributes.stock,attributes.value,id"
          has-image="true"
          :special-filter="this.$route.params.colisionName"
          :special-filter-path="
            'relationships.' + this.nameRelationships() + '.data.name'
          "
          special-filter-method="contains"
          :colision-type="this.$route.params.typeOfColision"
          :colision-name="this.$route.params.colisionName"
        ></products-table>
      </section>
    </section>
  </div>
</template>

<script>
import TopBar from "../components/TopBar.vue";
import SideBar from "../components/SideBar.vue";
import ProductsTable from "../components/ProductsTable.vue";
import ApiResources from "@/services/ApiResources";
import FilterJson from "@/services/FilterJson";

export default {
  props: ["categoryName"],
  components: {
    TopBar,
    SideBar,
    ProductsTable,
  },
  methods: {
    nameRelationships(name = this.$route.params.typeOfColision + "Singular") {
      let names = {
        categories: "categoria",
        measures: "unidades de medida",
        categoriesTopBar: "Categoria",
        measuresTopBar: "Unidades de medida",
        categoriesSingular: "category",
        measuresSingular: "measure",
      };
      return names[name];
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
  },
  data() {
    return {
      productsAmount: "",
      categoriesAmount: "",
    };
  },
  async beforeMount() {
    this.productsAmount = FilterJson.getValue(
      await ApiResources.getRequest("products"),
      ["data", "data"]
    );
    this.productsAmount = this.productsAmount.length;
    this.categoriesAmount = FilterJson.getValue(
      await ApiResources.getRequest("categories"),
      ["data"]
    );
    this.categoriesAmount = this.categoriesAmount.length;
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  display: flex;
  flex-direction: row;
  width: 100vw;
}

.content {
  width: 100%;
}

.dashItens {
  display: flex;
  flex-direction: row;
  width: 100%;
  flex-wrap: wrap;
  justify-content: left;
}
</style>
