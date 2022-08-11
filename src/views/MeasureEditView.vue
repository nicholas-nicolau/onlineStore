<template>
  <div class="container">
    <div class="navegation">
      <side-bar></side-bar>
    </div>
    <section class="content">
      <top-bar caption-name="Unidades de Medida"></top-bar>
      <measure-details></measure-details>
    </section>
  </div>
</template>

<script>
import TopBar from "../components/TopBar.vue";
import SideBar from "../components/SideBar.vue";
import MeasureDetails from "../components/MeasureDetails.vue";

export default {
  components: {
    TopBar,
    SideBar,
    MeasureDetails,
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
  max-height: 100vh;
}

.content {
  width: 100%;
}
</style>
