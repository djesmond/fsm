<template>
  <div id="canvasContainer">
    <canvas id="canvas" class="canvas" :width="canvasWidth" :height="canvasHeight"></canvas>
  </div>
</template>
<script>
export default {
  methods: {
  },
  computed: {
    canvasWidth() {
      // Dynmically set the width of the canvas
      return window.innerWidth;
    },
    canvasHeight() {
      // Dynmically set the height of the canvas
      return window.innerHeight - 105;
    },
  },
  mounted() {
    // This needs to be refactored as we progress with moving control to Vue
    state.canvas = document.getElementById('canvas');
  },
}
</script>
<style lang="scss" scoped>

</style>
