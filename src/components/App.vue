<template>
  <div>
    <div class="container">
      <div class="headerContainer">
        <div class="header">
          <p class="headerTitle">Finite State Machine Designer 1.1</p>
          <a href="https://github.com/djesmond/fsm" class="github">
            <i class="fa fa-github fa-2x"></i>
          </a>
        </div>
        <div class="toolbox">
          <div @click="clearCanvas" class="toolboxButton clear">
            <i class="fa fa-trash" aria-hidden="true"></i>Clear</div>
          <div @click="showImport = !showImport" class="toolboxButton import">
            <i class="fa fa-upload" aria-hidden="true"></i>Import</div>
          <div @click="showExport = !showExport" class="toolboxButton export">
            <i class="fa fa-download" aria-hidden="true"></i>Export</div>
          <div @click="showHelp = !showHelp" class="toolboxButton toggleHelp">
            <i class="fa fa-question-circle" aria-hidden="true"></i>Help</div>
        </div>
      </div>
      <div class="content">
        <Help v-show="showHelp"/>
        <CanvasController :triggerClear="triggerClear" v-on:hasCleared="hasCleared" />
      </div>
      <footer>
        <p>Created by
          <a href="http://madebyevan.com/">Evan Wallace</a> in 2010, updated by
          <a href="http://paavo.me/">Paavo Huhtala (2016 - 2017)</a> and
          <a href="https://github.com/djesmond">Niclas Sommer</a> in 2017
        </p>
      </footer>
      <ExportModal v-show="showExport" v-on:toggleExport="toggleExport"/>
      <ImportModal v-show="showImport" v-on:toggleImport="toggleImport"/>
    </div>
  </div>
</template>
<script>
import ExportModal from './ExportModal.vue';
import ImportModal from './ImportModal.vue';
import Help from './Help.vue';
import CanvasController from './CanvasController.vue';

export default {
  data() {
    return {
      showHelp: true,
      showExport: false,
      showImport: false,
      triggerClear: false,
    }
  },
  components: {
    ExportModal,
    ImportModal,
    Help,
    CanvasController,
  },
  methods: {
    toggleExport(show) {
      this.showExport = show;
    },
    toggleImport(show) {
      this.showImport = show;
    },
    clearCanvas() {
      this.triggerClear = true;
    },
    hasCleared() {
      this.triggerClear = false;
    }
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
  cursor: pointer;
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
footer {
  pointer-events:none; 
  position: fixed;
  bottom: 0px;
  width: 100%;
  text-align: center;
  color: #A3A3A3;
}
footer a {
  pointer-events:auto;
  color: #A3A3A3;
}
</style>
