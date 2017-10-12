<template>
  <Modal :title="'Export as:'" v-on:toggleShow="toggleShow">
    <div slot="content">
      <p>Note that the grid is not exported</p>
      <a href="javascript:saveAsPNG()">PNG</a> |
      <a href="javascript:saveAsSVG()">SVG</a> |
      <a href="javascript:saveAsLaTeX()">LaTeX</a> |
      <a href="javascript:saveAsJSON()">JSON</a>
      <textarea id="output" class="exportOutput"></textarea>
    </div>
  </Modal>
</template>
<script>
import Modal from './Modal';
export default {
  components: {
    Modal,
  },
  methods: {
    toggleShow() {
      this.$emit('toggleExport', false);
    }
  }
  
}
</script>
<style lang="scss" scoped>
.exportOutput {
  width: 100%;
  min-height: 100px;
  height: 90%;
}
</style>
