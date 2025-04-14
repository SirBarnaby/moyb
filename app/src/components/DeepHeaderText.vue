<script setup lang="ts">
defineProps<{
  msg: string
  img_url: string
  animationClass?: string
}>()

const emit = defineEmits(['click'])

function handleClick() {
  emit('click')
}
</script>


<template>
  <div class="deep-header-container" @click="handleClick" :class="animationClass">
    <div class="infotexticon">
      <img v-bind:src="img_url" alt="Circular dot.">
    </div>
    <div class="infotext">
      <div class="text-block">
        <p>{{ msg }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.deep-header-container {
  display: flex;
  align-items: center;
  cursor: pointer;
}

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

.blurry-fade-out {
  animation: blurryFadeOut 0.5s forwards;
}

.blurry-fade-in {
  animation: blurryFadeIn 0.5s forwards;
}

@keyframes blurryFadeOut {
  0% {
    opacity: 1;
    filter: blur(0);
  }
  100% {
    opacity: 0;
    filter: blur(8px);
  }
}

@keyframes blurryFadeIn {
  0% {
    opacity: 0;
    filter: blur(8px);
  }
  100% {
    opacity: 1;
    filter: blur(0);
  }
}
</style>
