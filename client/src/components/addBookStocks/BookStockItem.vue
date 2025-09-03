<template>
	<v-hover v-slot="{ isHovering, props }">
		<v-list-item
			v-bind="props"
			nav
			class="px-0"
		>
			<template v-if="metadata" v-slot:prepend>
				<img
					v-if="metadata.image_url != null"
					:src="metadata.image_url"
					style="height: 40px; margin-right: 10px"
				/>
				<div
					v-else
					style="background-color: #f1f1f1; height: 40px; width: 30px; margin-right: 10px; display: flex; align-items: center; justify-content: center"
				>
					<v-icon>mdi-image-outline</v-icon>
				</div>
			</template>

			<template v-slot:default>
				<template v-if="metadata">
					<v-list-item-title>
						{{ metadata.name }} 
					</v-list-item-title>
				</template>

				<template v-else>
					<v-list-item-title>
						{{ code }}
					</v-list-item-title>
					<v-progress-linear v-if="loading" color="primary" indeterminate/>
				</template>
			</template>

			<template v-if="isHovering" v-slot:append>
				<v-btn
					variant="text"
					density="compact"
					icon
					@click="$emit('remove')"
				>
					<v-icon color="red">mdi-close</v-icon>
				</v-btn>
			</template>
		</v-list-item>
	</v-hover>
</template>

<script setup lang="ts">

import {IBookAddMd} from "@/types/book/IBookAddMd";

interface Props {
	metadata?: IBookAddMd,
	code: string;
	loading?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
	(e: 'remove'): void
}>()

</script>

<style scoped>

</style>