<template>
  <div id="helpContainer" class="help">
    <p>This big grid is the FSM designer.&nbsp; Here's how to use it:</p>
    <ul>
      <li>
        <b>Add a state:</b> double-click on the canvas</li>
      <li>
        <b>Add an arrow transition:</b> shift-drag on the canvas</li>
      <li>
        <b>Curve a transition:</b> click and hold an existing transition. Drag it around</li>
      <li>
        <b>Move something:</b> drag it around</li>
      <li>
        <b>Delete something:</b> click it and press the delete key (not the backspace key) this is fn + backspace on MacBooks</li>
    </ul>
    <ul>
      <li>
        <b>Make accept state:</b> double-click on an existing state</li>
      <li>
        <b>Type numeric subscript:</b> put an underscore before the number (like "S_0")</li>
      <li>
        <b>Type greek letter:</b> put a backslash before it (like "\beta")</li>
    </ul>
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
  width: 20%;
  padding: 8px;
}
</style>
