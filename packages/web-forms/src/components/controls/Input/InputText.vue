<script setup lang="ts">
import type { StringInputNode, TemporaryStringValueInputNode } from '@getodk/xforms-engine';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import { computed, inject } from 'vue';

const MULTILINE_APPEARANCE_ROW_SIZE = 4;

// prettier-ignore
type TextInputNode =
	| StringInputNode
	| TemporaryStringValueInputNode;

interface InputTextProps {
	readonly node: TextInputNode;
}

const props = defineProps<InputTextProps>();

const setValue = (value = '') => {
	props.node.setValue(value);
};

const doneAnswering = inject<boolean>('doneAnswering');
const submitPressed = inject<boolean>('submitPressed');
const invalid = computed(() => props.node.validationState.violation?.valid === false);
const rows = computed(() => {
	const options = props.node.nodeOptions;
	if (options && 'rows' in options && options.rows != null) {
		return options.rows;
	}

	if (props.node.appearances.multiline) {
		return MULTILINE_APPEARANCE_ROW_SIZE;
	}

	return 0;
});
</script>

<template>
	<template v-if="rows > 0">
		<Textarea
			:id="node.nodeId"
			:required="node.currentState.required"
			:disabled="node.currentState.readonly"
			:class="{'inside-highlighted': invalid && submitPressed}"
			:model-value="node.currentState.value"
			:rows="rows"
			@update:model-value="setValue"
			@input="doneAnswering = false"
			@blur="doneAnswering = true"
		/>
	</template>
	<template v-else>
		<InputText
			:id="node.nodeId"
			:required="node.currentState.required"
			:disabled="node.currentState.readonly"
			:class="{'inside-highlighted': invalid && submitPressed}"
			:model-value="node.currentState.value"
			@update:model-value="setValue"
			@input="doneAnswering = false"
			@blur="doneAnswering = true"
		/>
	</template>
</template>

<style scoped>
.p-inputtext {
	width: 100%;
}

.p-textarea {
	width: 100% !important; /* Overrides forced width when resize is set to vertical */
	resize: vertical;
}
</style>
