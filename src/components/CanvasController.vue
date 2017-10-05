<template>
  <div id="canvasContainer">
  </div>
</template>
<script>
export default {
  mounted() {
    // Create and inject the canvas with js to get the correct dimensions
    var canvas = document.createElement('canvas');
    canvas.id = "canvas";
    canvas.classList.add('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 105;
    document.getElementById('canvasContainer').appendChild(canvas);
    // This needs to be refactored as we progress with moving control to Vue
    state.canvas = document.getElementById('canvas');
  }
}
</script>
<style lang="scss" scoped>

</style>
