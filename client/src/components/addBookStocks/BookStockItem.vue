<template>
		<v-list-item
			nav
			class="px-0"
		>
			<template v-if="metadata" v-slot:prepend>
				<img
					v-if="metadata.image_url != null"
					:src="metadata.image_url"
					style="height: 60px; margin-right: 10px"
				/>
				<div
					v-else
					style="background-color: #f1f1f1; height: 60px; width: 35px; margin-right: 10px; display: flex; align-items: center; justify-content: center"
				>
					<v-icon>mdi-image-outline</v-icon>
				</div>
			</template>

			<template v-slot:default>
				<v-list-item-title
					v-if="metadata"
					style="font-size: 14px"
				>
					{{ metadata.name }}
				</v-list-item-title>

				<template v-else>
					<v-list-item-title style="font-size: 12px">
						{{ code }}
					</v-list-item-title>
					<v-progress-linear v-if="loading" color="primary" indeterminate/>
				</template>
			</template>

			<template v-slot:append>
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
</template>

<script setup lang="ts">
import {IBookAddMd} from "@/types/book/IBookAddMd";

interface Props {
	metadata?: IBookAddMd,
	code: string;
	loading?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
	(e: 'remove'): void
}>()

</script>