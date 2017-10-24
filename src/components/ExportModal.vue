<template>
  <Modal class="exportModal" :title="'Export as'" v-on:toggleShow="toggleShow">
    <div slot="content">
      <p>Note that the grid is not exported</p>
      <a class="button" @click="saveAsPNG">PNG</a>
      <a class="button" @click="saveAsSVG">SVG</a>
      <a class="button" @click="saveAsLaTeX">LaTeX</a>
      <a class="button" @click="saveAsJSON">JSON</a>
    </div>
  </Modal>
</template>
<script>
import Modal from './Modal';
import { ExportAsLaTeX } from "../export_as/latex";
import { ExportAsSVG } from "../export_as/svg";
import { saveAs } from 'file-saver';

export default {
  props: [
    'state',
  ],
  data() {
    return {
    }
  },
  components: {
    Modal,
  },
  methods: {
    toggleShow() {
      this.$emit('toggleExport', false);
    },

    saveAsPNG() {
      const canvas = document.getElementById('canvas');
      canvas.toBlob((blob) => {
        saveAs(blob, "fsm.png");
      });
    },

    saveAsSVG() {
      const exporter = new ExportAsSVG();
      this.helper(exporter);
      const svgData = exporter.toSVG();
      const blob = new Blob([svgData], {type: "text/plain;charset=utf-8"});
      saveAs(blob, "fsm.svg");
    },

    saveAsLaTeX() {
      const exporter = new ExportAsLaTeX();
      this.helper(exporter);
      const texData = exporter.toLaTeX();
      const blob = new Blob([texData], {type: "text/plain;charset=utf-8"});
      saveAs(blob, "fsm.tex");
    },

    saveAsJSON() {
      const blob = new Blob([JSON.stringify(this.state)], {type: "application/json;charset=utf-8"});
      saveAs(blob, "fsm.json");
    },

    helper(exporter) {
      const {nodes, links} = this.state;
      // Draw each node
      nodes.map(node => {
        exporter.lineWidth = 1;
        // Draw the selected node as blue (if it exist)
        exporter.fillStyle = exporter.strokeStyle = 'black';
        node.draw(exporter);
      });

      links.map((link) => {
        exporter.lineWidth = 1;
        exporter.fillStyle = exporter.strokeStyle = 'black';
        link.draw(exporter);
      });
    }
  }

  }
</script>
<style lang="scss" scoped>
.button {
  display: inline-block;
  //background: #009688;
  border: 1px solid #dddedf;
  border-radius: 3px;
  padding: 0 20px;
  text-decoration: none;
  //color: #f9f6f2;
  color:#8b8c8d;
  height: 40px;
  line-height: 42px;
  text-align: center;
  margin: 10px 0;
  cursor: pointer;
  width: 80%;
  &:hover {
    background: rgba(0, 0, 0, 0.01);
  }
}
.exportModal {
  width: 300px;
  height: 400px;
  top: 30%;
  left: 35%; 
}
</style>
