<template>
  <div>
    <div class="container">
      <div class="headerContainer">
        <div class="header">
          <p class="headerTitle">Finite State Machine Designer 1.1</p>
          <a href="https://github.com/paavohuhtala/fsm" class="github">
            <i class="fa fa-github fa-2x"></i>
          </a>
        </div>
        <div class="toolbox">
          <a href="javascript:clearCanvas()" class="toolboxButton clear">
            <i class="fa fa-trash" aria-hidden="true"></i>Clear</a>
          <div class="toolboxButton import">
            <i class="fa fa-upload" aria-hidden="true"></i>Import</div>
          <a href="javascript:toggleExport()" class="toolboxButton export">
            <i class="fa fa-download" aria-hidden="true"></i>Export</a>
          <a href="javascript:toggleHelp()" class="toolboxButton toggleHelp">
            <i class="fa fa-question-circle" aria-hidden="true"></i>Help</a>
        </div>
      </div>
      <div class="content">
        <Help/>
        <CanvasController />
      </div>
      <footer>
        <p>Created by
          <a href="http://madebyevan.com/">Evan Wallace</a> in 2010, updated by
          <a href="http://paavo.me/">Paavo Huhtala</a> and
          <a href="https://github.com/djesmond">Niclas Sommer</a> in 2016 - 2017.</p>
      </footer>
      <Modal/>
    </div>
  </div>
</template>
<script>
import Modal from './Modal.vue';
import Help from './Help.vue';
import CanvasController from './CanvasController.vue';

export default {
  components: {
    Modal,
    Help,
    CanvasController,
  },
};
</script>
<style lang="scss" scoped>
.container {
}

.headerContainer {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
}

.header {
  height: 60px;
  background-color: #009688;
  border-width: 0 0 1px 0;
  border-color: #B6B6B6;
  border-style: solid;
  padding-left: 16px;
}

.headerTitle {
  font-size: 24px;
  font-weight: 300;
  color: white;
  margin: 16px 0 0 0;
  display: inline-block;
}

.github {
  width: 40px;
  height: 60px;
  float: right;
  position: relative;
  right: 20px;
  color: white;
  padding-top: 15px;

}

.toolbox {
  width: 100%;
  height: 40px;
  background-color: white;
  border-width: 0 0 1px 0;
  border-style: solid;
  border-color: lightgrey;

}

.toolboxButton {
  height: 40px;
  float: left;
  padding: 0 8px;
  text-decoration: none;
  color: #292929;
}

.toolboxButton i {
  padding-top: 12px;
  margin-right: 4px;
}
.toggleHelp {
  float: right;
  padding-right: 0;
}

.content {
  margin-top: 100px;
  width: 100%;
}
</style>
