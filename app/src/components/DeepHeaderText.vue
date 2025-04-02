<script setup lang="ts">
defineProps<{
  msg: string
  img_url: string
}>()
</script>


<template>
  <div class="infotexticon">
    <img v-bind:src="img_url" alt="Circular dot.">
  </div>
  <div class="infotext">
    <div class="text-block">
      <p>{{ msg }}</p>
    </div>
  </div>
</template>

<style scoped>
.infotext {
  display: block;
  align-self: center;
}

.infotexticon {
}

.text-block {
  display: block;
  font-family: Montserrat;
  font-weight: 700;
}
</style>
