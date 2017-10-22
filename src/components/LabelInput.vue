<template>
  <div 
    class="labelContainer">
    <div class="labelHeader">Label</div>
    <input
      v-model="labelText" 
      type="text"
      placeholder="Label"
      id="labelInput"
      class="labelInput"
    />
  </div>
</template>
<script>
export default {
  props: [
    'text',
    'showing',
  ],
  data() {
    return {
      labelText: this.text,
    }
  },
  watch: {
    showing(show) {
      if (show) {
        document.getElementById('labelInput').focus();
      }
    },
    labelText(text){
      this.$emit('labelUpdate', text);
    },
    text(text) {
      this.labelText = text;
    }
  }
}
</script>
<style lang="scss" scoped>
.labelContainer {
    position: absolute;
    width: 150px;
  }
  .labelHeader {
    border-radius: 3px 3px 0 0;
    width: 100%;
    height: 25px;
    background-color: #ededed;
    padding: 4px 8px 0 8px;
    border: 1px solid #c3c3c3;
    border-bottom: 0px;
    color: grey;
  }
.labelInput {
    height: 15px;
    width: 100%;
    border-radius: 0 0 3px 3px;
    border: 1px solid #c3c3c3;
    -webkit-appearance: none;
    font-size: 14px;
    padding: 8px;
    
    &:focus {
      border: 1px solid #c3c3c3;
      outline: 0;
    }
  }
</style>
