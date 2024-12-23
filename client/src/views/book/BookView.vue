<template>
	<page-component :model="model">
		<book-details
			v-if="model.hasBook()"
			:book="model.getBook()"
		/>
	</page-component>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import PageComponent from "@/views/PageComponent.vue";
import BookController from "@/controller/book/BookController";
import BookDetails from "@/components/book/details/BookDetails.vue";

export default defineComponent({
	name: "BookView",
	components: {BookDetails, PageComponent},
	setup() {
		const model = new BookController();
		return {
			model,
		}
	}
});
</script>

<style scoped lang="scss">

</style>