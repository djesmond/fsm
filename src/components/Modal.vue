<template>
  <div class="modal">
    <div class="modalTitle">{{title}}</div>
    <div class="modalContent">
      <slot name="content"></slot>
    </div>
    <div class="modalButtonsContainer">
      <div @click="requestClose" class="modalButton buttonClose">CLOSE</div>
    </div>
  </div>
</template>
<script>
export default {
  props: [
    'title',
    'styling',
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
  background-color: white;
  border-width: 1px;
  border-style: solid;
  border-color: lightgrey;
  border-radius: 4px;
  z-index: 9999;
}
.modalTitle {
  font-size: 18px;
  font-weight: 700;
  padding: 16px 16px 0 16px;
  width: 60%;
  display: inline-block;
}

.modalContent {
  margin: 16px;
  width: 90%;
  font-size: 16px;

}

.modalButtonsContainer {
  border: 1px solid #eee;
  width: 100%;
  display: flex;
  position: absolute;
  bottom: 0px;
  flex-wrap: nowrap;

.modalButton {
  flex-grow: 1;
  text-align: center;
  height: 44px;
  line-height: 44px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  &:hover {
    background: rgba(0, 0, 0, 0.01);
  }
  &:not(:first-child) {
    border-left: 1px solid #eee;
  }
}


}
</style>
