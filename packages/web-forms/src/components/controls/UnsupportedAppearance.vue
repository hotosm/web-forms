<script setup lang="ts">
defineProps<{ nodeType: string; appearance: string }>();

const isDev = () => {
	return import.meta.env.DEV;
};
</script>
<template>
	<div v-if="isDev()" style="margin-bottom: 20px">
		Unsupported appearance {<strong>{{ appearance }}</strong>} for the {<strong>{{ nodeType }}</strong>}.
	</div>
</template>

