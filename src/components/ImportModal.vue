<template>
  <Modal :title="'Import machine:'" v-on:toggleShow="toggleShow">
    <div slot="content">
      <p>Upload a JSON file with the state machine </p>
      <input type="file" @change="handleFiles" accept="application/json">
    </div>
  </Modal>
</template>
<script>
import Modal from './Modal';
export default {
  data() {
    return {
      data: '',
    }
  },
  watch: {
    data(text) {
      if (JSON.parse(text)) {
        localStorage.setItem('fsm', text);
        this.$emit('triggerReload', true);
      }
    }
  },
  components: {
    Modal,
  },
  methods: {
    toggleShow() {
      this.$emit('toggleImport', false);
    },
    handleFiles(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        this.data = event.target.result;
      };
      reader.readAsText(file);
    },
  }
  
}
</script>
<style lang="scss" scoped>
</style>
