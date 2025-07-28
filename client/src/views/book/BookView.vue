<template>
	<page-component :model="model">
		<book-details
			v-if="model.hasBook()"
			:book="model.getBook()"
		/>
	</page-component>
</template>

<script setup lang="ts">
import PageComponent from "@/views/PageComponent.vue";
import BookController from "@/controller/book/BookController";
import BookDetails from "@/views/book/BookDetails.vue";

const model = new BookController();

</script>