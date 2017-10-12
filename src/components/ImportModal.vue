<template>
  <Modal :title="'Import machine:'" v-on:toggleShow="toggleShow">
    <div slot="content">
      <p>Currently not implemented</p>
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
      this.$emit('toggleImport', false);
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
