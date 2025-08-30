<template>
	<v-snackbar
		v-model="isVisible"
		:timeout="snackbar?.duration ?? 4000"
		location="top right"
		position="absolute"
		:color="color"
	>
		{{ snackbar?.message }}

		<template v-slot:actions>
			<v-btn
				v-if="snackbar?.actionLabel"
				variant="text"
				@click="handleAction"
			>
				{{ snackbar.actionLabel }}
			</v-btn>
		</template>
	</v-snackbar>
</template>

<script setup lang="ts">
import {ref, onMounted, onUnmounted, computed} from "vue";
import {appSnackbarController, SnackbarOptions, SnackbarType} from "@/components/appSnackbar/AppSnackbarController";

const snackbar = ref<SnackbarOptions | null>(null);
const isVisible = ref(false);

function handleAction() {
	snackbar.value?.onAction?.();
	appSnackbarController.clear();
}

const color = computed(() => {
	const snack = snackbar.value;
	if(snack) {
		const type = snack.type || SnackbarType.SUCCESS;
		switch (type) {
			case SnackbarType.SUCCESS:
				return "success";
			case SnackbarType.ERROR:
				return "error";
		}
	}
	return "";
})

onMounted(() => {
	const unsubscribe = appSnackbarController.subscribe((options) => {
		snackbar.value = options;
		isVisible.value = !!options;
		console.log("inside")
	});

	onUnmounted(() => {
		unsubscribe();
	});
});
</script>
