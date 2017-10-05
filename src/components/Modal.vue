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
<style lang="scss" scoped>
.modal {
  position: fixed;
  width: 70%;
  height: 60%;
  top: 15%;
  left: 15%;
  background-color: white;
  border-width: 1px;
  border-style: solid;
  border-color: lightgrey;
  border-radius: 4px;
}
.modalTitle {
  font-size: 20px;
  padding: 16px;
  width: 60%;
  display: inline-block;
}

.modalClose {
  float: right;
  position: relative;
  right: 16px;
  top: 16px;
  color: black;
  text-decoration: none;
}

.modalContent {
  margin: 16px;
  width: 90%;
  height: 70%;

}
.exportOutput {
  width: 100%;
  min-height: 100px;
  height: 90%;
}
</style>
