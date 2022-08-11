<template>
  <div class="container">
    <div class="textArea">
      <p class="title">{{ captionItem }}</p>
      <p class="amount">{{ amountItem }}</p>
    </div>
    <img :src="getImgUrl(nameItem)" />
  </div>
</template>

<script>
export default {
  props: ["captionItem", "amountItem", "nameItem"],
  methods: {
    getImgUrl(name) {
      let images = require.context("../assets/", false, /.png$/);
      return images("./" + name + ".png");
    },
  },
};
</script>

<style scoped>
.container {
  align-items: center;
  border: 0.5px solid lightgrey;
  border-radius: 15px;
  box-shadow: 5px 5px 5px grey;
  display: flex;
  height: 150px;
  justify-content: space-between;
  margin: 5px;
  padding: 0 8px;
  width: 320px;
}

img {
  width: 90px;
  height: auto;
}

.title,
.amount {
  font-size: 18px;
  font-weight: bold;
  color: black;
}

.amount {
  font-size: 80px;
}
</style>
