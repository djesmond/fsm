<template>
  <div id="exportModal" class="modal">
    <div class="modalTitle">{{title}}</div>
    <div @click="requestClose" class="modalClose">
      <i class="fa fa-times" aria-hidden="true"></i>
    </div>
    <div class="modalContent">
      <slot name="content"></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: [
    'title',
  ],
  data() {
    return {
    }
  },
  methods: {
    requestClose() {
      this.$emit('toggleShow', false);
    }
  }
};
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
  cursor: pointer;
}

.modalContent {
  margin: 16px;
  width: 90%;
  height: 70%;

}
</style>
