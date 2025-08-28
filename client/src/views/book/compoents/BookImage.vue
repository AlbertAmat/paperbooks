<template>
	<v-hover v-slot="{ isHovering, props }">
		<v-card
			v-bind="props"
			style="width: 100%; padding: 0"
			height="450px"
			min-height="450px"
			variant="text"
			@drop.prevent="handleDrop"
			@dragover.prevent
			@click="triggerFileSelect"
		>
			<v-img
				cover
				max-height="450px"
				min-height="450px"
				:src="showFallbackImage ? notFound : book.getImageUrl()"
				@error="showFallbackImage = true"
			>
				<v-expand-transition>
					<div
						v-if="isHovering || loading"
						class="book-image-hover gradient-transparent"
					>
						<v-progress-circular
							v-if="loading"
							color="white"
							size="60"
							indeterminate
						/>

						<template v-else>
							<v-icon size="60">mdi-plus</v-icon>
							<span style="font-size: 20px; font-weight: bold">Drag and drop an image</span>
						</template>
					</div>
				</v-expand-transition>
			</v-img>
			<!-- Hidden file input for click selection -->
			<input
				ref="fileInput"
				type="file"
				accept="image/*"
				style="display: none"
				@change="handleFileSelect"
			/>
		</v-card>
	</v-hover>
	<div style="text-align: center; width: 100%; color: #afafaf">(Hover to change book image)</div>
</template>

<script setup lang="ts">
import Book from "@/model/book/Book";
import notFound from "@/assets/images/notFound.jpg";
import { ref, Ref } from "vue";

interface Props {
	book: Book;
}

const props = defineProps<Props>();

const loading: Ref<boolean> = ref(false);

const showFallbackImage: Ref<boolean> = ref(false);

const fileInput = ref<HTMLInputElement | null>(null);

// Trigger hidden file input
const triggerFileSelect = () => {
	fileInput.value?.click();
};

// Handle file selected via click
const handleFileSelect = (event: Event) => {
	const target = event.target as HTMLInputElement;
	if (target.files && target.files[0]) {
		loadImage(target.files[0]);
	}
};

// Handle drag & drop
const handleDrop = (event: DragEvent) => {
	const files = event.dataTransfer?.files;
	if (files && files[0]) {
		loadImage(files[0]);
	}
};

// Read and display the selected image
async function loadImage(file: File) {
	try {
		loading.value = true;
		await props.book.changeImage(file);
	} finally {
		loading.value = false;
	}
};
</script>

<style scoped>
.book-image-hover {
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	color: white;
	cursor: pointer;
}
</style>
