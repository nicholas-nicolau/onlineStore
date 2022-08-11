<template>
  <div class="container">
    <div class="navegation">
      <side-bar></side-bar>
    </div>
    <section class="content">
      <top-bar caption-name="Produtos"></top-bar>
      <section class="table">
        <products-table
          caption-text="Listagem de Todos os Produtos"
          input-text-path-to-filter="Nome"
          input-text-method="contains"
          request-type="products"
          request-base-path="data,data"
          table-headers="Imagem,Nome,Detalhes,Categoria,Un,Estoque,Valor,ID"
          table-headers-paths="attributes.image-url,attributes.name,attributes.details,relationships.category.data.name,relationships.measure.data.name,attributes.stock,attributes.value,id"
          filter-by-highlight="false"
          has-image="true"
        ></products-table>
      </section>
    </section>
  </div>
</template>

<script>
import TopBar from "../components/TopBar.vue";
import SideBar from "../components/SideBar.vue";
import ProductsTable from "../components/ProductsTable.vue";

export default {
  components: {
    TopBar,
    SideBar,
    ProductsTable,
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
