<template>
	<v-card :class="cardCssClass" class="dashboard-card" elevation="0">
		<v-card-title
			class="d-flex align-center"
			:class="large ? 'py-3' : 'pt-2'"
			:style="{fontSize: large ? '18px' : '15px'}"
			style="font-weight: 550"
		>
			{{ title }}
		</v-card-title>
		<v-divider v-if="large"></v-divider>
		<v-card-text class="mx-1 mb-1 pa-2" style="background-color: white; border-radius: 10px; flex: 1">
			<slot></slot>
		</v-card-text>
	</v-card>
</template>

<script setup lang="ts">

interface Props {
	title:  string;
	large?:  boolean;
	cardCssClass?:  string;
}

const props = defineProps<Props>()
</script>

<style scoped>
.dashboard-card {
	border: 1px solid #e8e7e7;
	border-radius: 10px;
	display: flex;
	flex-direction: column;
}
</style>