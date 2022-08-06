<template>
  <div class="navegation">
    <img src="../assets/coyoLogo.jpg" />
    <nav>
      <a href="#" class="navegationLink">Categorias</a>
      <a href="#" class="navegationLink">Produtos</a>
      <a href="#" class="navegationLink">Clientes</a>
    </nav>
  </div>
</template>

<style scoped>
.navegation {
  height: 100vh;
  width: 300px;
  background-image: linear-gradient(#f43d3e, #93291e);
  margin-right: 10px;
}

.navegationLink {
  color: #ffffff;
  font-size: 25px;
  text-decoration: none;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  margin: 3px 0px;
}

nav {
  display: flex;
  flex-direction: column;
  padding: 0 3px;
}
</style>
