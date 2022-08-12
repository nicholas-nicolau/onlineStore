<template>
  <div class="container">
    <div class="navegation">
      <side-bar></side-bar>
    </div>
    <section class="content">
      <top-bar caption-name="Unidades de Medida"></top-bar>
      <section class="table">
        <products-table
          caption-text="Listagem de Unidades de Medida"
          input-text-path-to-filter="Nome"
          input-text-method="contains"
          request-type="measures"
          request-base-path="data"
          table-headers="ID,Nome"
          table-headers-paths="id,name"
          has-image="false"
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
