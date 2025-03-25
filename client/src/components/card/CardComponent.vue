<template>
	<v-card
		flat
		class="pa-0"
		:class="outline ? 'app-border-2' : ''"
	>
		<v-card-title
			v-if="!dense"
			class="d-flex align-center px-0 pt-0"
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

<script lang="ts">
import {defineComponent} from 'vue'
import AddBookStock from "@/components/book/details/compoents/AddBookStock.vue";

export default defineComponent({
	name: "CardComponent" ,
	components: {AddBookStock},
	props: {
		title: {
			type: String,
			required: true
		},
		icon: {
			type: String,
			required: true
		},
		counter: {
			type: Number,
		},
		outline: {
			type: Boolean,
			default: false
		},
		dense: {
			type: Boolean,
			default: false
		},
	}
})
</script>

<style scoped lang="scss">

</style>