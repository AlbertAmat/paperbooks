<template>
	<div style="position: relative; overflow-y: auto">
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

<script lang="ts">
import {defineComponent} from "vue";
import {BaseController} from "@/controller/BaseController";

export default defineComponent({
	name: "PageComponent",
	props: {
		model: {
			type: Object as () => BaseController<any>,
			required: true
		}
	},
	setup() {


		return {

		}
	}
});
</script>

<style scoped lang="scss">

</style>