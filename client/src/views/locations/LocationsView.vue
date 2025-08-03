<template>
	<page-component :model="model">
		<template v-slot:append>
			<v-btn
				class="text-none gradient"
				color="primary"
				small
			>
				Add
			</v-btn>
		</template>

		<template v-slot:default>
			Locations
		</template>
	</page-component>
</template>

<script setup lang="ts">
import PageComponent from "@/views/PageComponent.vue";
import LocationsController from "@/controller/locations/LocationsController";

const model = new LocationsController();

</script>