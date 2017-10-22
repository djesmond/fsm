<template>
<div id="helpContainer" class="help">
  <div><b>Add a state:</b> double-click on the canvas</div>
  <div><b>Add an arrow transition:</b> <span class="key">shift</span> + drag on the canvas</div>
  <div><b>Curve a transition:</b> click and hold an existing transition. Drag it around</div>
  <div><b>Move something:</b> drag it around</div>
  <div><b>Delete something:</b> click it and press <span class="key">delete</span> . This
    is <span class="key">fn</span> + <span class="key">backspace</span> on MacBooks</div>
  <div><b>Make accept state:</b> double-click on an existing state</div>
  <div><b>Type numeric subscript:</b> put an <span class="key">_</span> before the number (like "S_0")</div>
  <div><b>Type greek letter:</b> put a <span class="key">\</span> before it (like "\beta")</div>
</div>
</template>
<script>
export default {

}
</script>
<style lang="scss" scoped>
.help {
  background-color: white;
  border: 1px solid rgba(211, 211, 211, 0.36);
  border-radius: 2px;
  position: fixed;
  right: 8px;
  top: 100px;
  width: 25%;
  padding: 8px;

  div {
    margin-bottom: 8px;
    line-height: 30px;
  }
}

.key {
  color: #5E5E5E;
  text-decoration: none;
  text-align: center;
  font-size: 12px;
  margin: 20px auto;
  padding: 5px 10px;
  background: #EFF0F2;
  border-radius: 4px;
  border-top: 1px solid #F5F5F5;
  box-shadow: inset 0 0 25px #E8E8E8, 0 1px 0 #C3C3C3, 0 2px 0 #C9C9C9, 0 2px 3px #333;
  text-shadow: 0px 1px 0px #F5F5F5;
}
</style>
