<template>
	<v-card
		variant="flat"
		class="pa-0"
		:class="outline ? 'app-border-2' : ''"
	>
		<v-card-title
			v-if="!dense"
			class="d-flex align-center px-0 pt-0"
			style="font-size: 16px"
		>
			<v-icon class="mr-2">{{icon}}</v-icon>

			{{ title }}

			<v-chip
				v-if="counter != undefined"
				small
				class="px-2 ml-2">
				{{ counter }}
			</v-chip>

			<v-spacer></v-spacer>

			<slot name="actions"></slot>
		</v-card-title>
		<v-card-text class="px-0 pb-0" :class="dense ? 'pt-0' : ''">
			<slot></slot>
		</v-card-text>
	</v-card>
</template>

<script setup lang="ts">

interface Props {
	title:  string;
	icon:  string;
	counter?: number;
	outline?: boolean
	dense?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	outline: false,  // ✅ no function needed for primitive
	dense: false
})
</script>