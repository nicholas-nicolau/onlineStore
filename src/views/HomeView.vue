<template>
  <div class="container">
    <div class="navegation">
      <side-bar></side-bar>
    </div>
    <section class="content">
      <top-bar caption-name="Dashboard"></top-bar>
      <section class="dashItens">
        <dash-item
          caption-item="Produtos cadastrados"
          :amount-item="productsAmount"
          name-item="boxIcon"
        ></dash-item>
        <dash-item
          caption-item="Categorias cadastradas"
          :amount-item="categoriesAmount"
          name-item="categoryIcon"
        ></dash-item>
      </section>
      <section class="table">
        <products-table
          caption-text="Listagem de Produtos em Destaque"
          input-text-path-to-filter="Nome"
          input-text-method="contains"
          request-type="products"
          request-base-path="data.data"
          table-headers="Imagem,Nome,Detalhes,Categoria,Un,Estoque,Valor,ID"
          table-headers-paths="attributes.image-url,attributes.name,attributes.details,relationships.category.data.name,relationships.measure.data.name,attributes.stock,attributes.value,id"
          filter-by-highlight="true"
          special-filter="true"
          special-filter-path="attributes.highlight"
          special-filter-method="equals"
          has-image="true"
        ></products-table>
      </section>
    </section>
  </div>
</template>

<script>
import TopBar from "../components/TopBar.vue";
import DashItem from "../components/DashItem.vue";
import SideBar from "../components/SideBar.vue";
import ProductsTable from "../components/ProductsTable.vue";
import ApiResources from "@/services/ApiResources";
import FilterJson from "@/services/FilterJson";

export default {
  components: {
    TopBar,
    DashItem,
    SideBar,
    ProductsTable,
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
