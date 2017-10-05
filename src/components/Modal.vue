<template>
  <div id="exportModal" class="modal hide">
    <div class="modalTitle">Export as:</div>
    <a href="javascript:toggleExport()" class="modalClose">
      <i class="fa fa-times" aria-hidden="true"></i>
    </a>
    <div class="modalContent">
      <p>Note that the grid is not exported</p>
      <a href="javascript:saveAsPNG()">PNG</a> |
      <a href="javascript:saveAsSVG()">SVG</a> |
      <a href="javascript:saveAsLaTeX()">LaTeX</a> |
      <a href="javascript:saveAsJSON()">JSON</a>
      <textarea id="output" class="exportOutput"></textarea>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style lang="sass" scoped>
</style>
