<template>
	<v-card class="mb-5 pb-4">
		<v-card-title>
			<span style="font-size: 16px; font-weight: 550">{{ title }}</span>
		</v-card-title>
		<v-divider class="mt-2 mb-5"></v-divider>

		<v-card-text>
			<slot></slot>
		</v-card-text>
	</v-card>
</template>

<script setup lang="ts">

interface Props {
	title: string;
}

const props = defineProps<Props>();
</script>
