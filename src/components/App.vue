<template>
	<div>
		<div class="container">
			<div class="headerContainer">
				<div class="header">
					<p class="headerTitle">Finite State Machine Designer 1.1</p>
					<a href="https://github.com/paavohuhtala/fsm" class="github"><i class="fa fa-github fa-2x"></i></a>
				</div>
				<div class="toolbox">
					<a href="javascript:clearCanvas()" class="toolboxButton clear"><i class="fa fa-trash" aria-hidden="true"></i>Clear</a>
					<div class="toolboxButton import"><i class="fa fa-upload" aria-hidden="true"></i>Import</div>
					<a href="javascript:toggleExport()" class="toolboxButton export"><i class="fa fa-download" aria-hidden="true"></i>Export</a>
					<a href="javascript:toggleHelp()" class="toolboxButton toggleHelp"><i class="fa fa-question-circle" aria-hidden="true"></i>Help</a>
				</div>
			</div>
			<div class="content">
				<div id="helpContainer" class="help">
					<p>This big grid is the FSM designer.&nbsp; Here's how to use it:</p>
					<ul>
						<li><b>Add a state:</b> double-click on the canvas</li>
						<li><b>Add an arrow transition:</b> shift-drag on the canvas</li>
						<li><b>Curve a transition:</b> click and hold an existing transition. Drag it around</li>
						<li><b>Move something:</b> drag it around</li>
						<li><b>Delete something:</b> click it and press the delete key (not the backspace key) this is fn + backspace on MacBooks</li>
					</ul>
					<ul>
						<li><b>Make accept state:</b> double-click on an existing state</li>
						<li><b>Type numeric subscript:</b> put an underscore before the number (like "S_0")</li>
						<li><b>Type greek letter:</b> put a backslash before it (like "\beta")</li>
					</ul>
				</div>
				<div id="canvasContainer"></div>
			</div>
			<footer>
				<p>Created by <a href="http://madebyevan.com/">Evan Wallace</a> in 2010, updated by <a href="http://paavo.me/">Paavo Huhtala</a>					and <a href="https://github.com/djesmond">Niclas Sommer</a> in 2016 - 2017.</p>
			</footer>
			<Modal/>
		</div>
	</div>
</template>
<script>
import Modal from './Modal.vue';
export default {
	components: {
		Modal,
	}
  
}
</script>
<style lang="scss" scoped>

</style>
