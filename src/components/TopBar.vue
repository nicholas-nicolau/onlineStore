<template>
  <div class="topBar">
    <p>{{ captionName }}</p>
  </div>
</template>

<style scoped>
.topBar {
  width: 100%;
  background-color: #f43d3e;
  border-radius: 0 0 0 10px;
  color: #ffffff;
  font-size: 25px;
  font-weight: bold;
  line-height: 40px;
  height: 40px;
}
</style>

<script>
export default {
  props: ["captionName"],
};
</script>
