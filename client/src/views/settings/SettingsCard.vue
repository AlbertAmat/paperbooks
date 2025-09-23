<template>
	<div class="pb-8">
		<span style="font-size: 16px; font-weight: 550">{{title}}</span>
		<v-divider class="mt-2 mb-5"></v-divider>

		<slot></slot>
	</div>
</template>

<script setup lang="ts">

interface Props {
	title:  string;
}

const props = defineProps<Props>();
</script>
