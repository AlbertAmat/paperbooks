<template>
	<div style="position: relative; height: 100%">
		<v-overlay
			v-if="model.isLoading()"
			:opacity="0"
			absolute
		>
			<v-progress-circular
				color="primary"
				indeterminate
			/>
		</v-overlay>

		<v-alert
			v-else-if="model.hasError()"
			type="error"
		>
			{{model.getError().message}}
		</v-alert>

		<template v-else>
			<slot></slot>
		</template>
	</div>
</template>

<script setup lang="ts">
import {BaseController} from "@/controller/BaseController";

interface Props {
	model: BaseController<any>
}

const props = defineProps<Props>()

</script>