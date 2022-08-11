<template>
  <div class="navegation">
    <router-link to="/"><img src="../assets/coyoLogo.jpg" /></router-link>
    <nav>
      <div class="navegationLink">
        <router-link class="navegationText" to="/products"
          >Produtos</router-link
        >
        <button title="Criar novo produto" @click="goToNewRoute('products')">
          +
        </button>
      </div>
      <div class="navegationLink">
        <router-link class="navegationText" to="/categories"
          >Categorias</router-link
        >
        <button
          title="Criar nova categoria"
          @click="goToNewRoute('categories')"
        >
          +
        </button>
      </div>
      <div class="navegationLink">
        <router-link class="navegationText" to="/measures"
          >Unidades</router-link
        >
        <button
          title="Criar nova unidade de medida"
          @click="goToNewRoute('measures')"
        >
          +
        </button>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  methods: {
    goToNewRoute(obj) {
      this.$router.push(`/${obj}/new`);
    },
  },
};
</script>

<style scoped>
.navegation {
  height: 100vh;
  width: 300px;
  background-image: linear-gradient(#f43d3e, #93291e);
  margin-right: 10px;
}

.navegationLink {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  margin: 3px 0px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.navegationText {
  font-size: 25px;
  color: #ffffff;
  text-decoration: none;
  width: 100%;
}
button {
  background: transparent;
  border: none;
  font-size: 30px;
  color: white;
  margin-right: 5px;
  margin-left: 10px;
}
button:hover {
  cursor: pointer;
}
nav {
  display: flex;
  flex-direction: column;
  padding: 0 3px;
}
</style>
