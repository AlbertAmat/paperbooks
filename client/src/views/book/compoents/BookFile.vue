<template>
	<card-component
		:title="t(AppLabels.EBOOK_FILE)"
		icon="mdi-file-download-outline"
		dense
	>
		<template v-slot:default>
			<div v-if="file" class="d-flex align-center">
				<v-icon size="40" class="mr-3" color="primary">
					{{ file.file_type === 'epub' ? 'mdi-book-open-page-variant-outline' : 'mdi-file-pdf-box' }}
				</v-icon>
				<div class="flex-grow-1" style="min-width: 0">
					<div class="text-truncate">{{ file.file_name }}</div>
					<div class="text-caption" style="color: var(--pb-text-muted)">
						{{ formattedSize }} &middot; {{ formattedDate }}
					</div>
				</div>
				<v-btn
					icon
					variant="text"
					density="comfortable"
					:href="downloadUrl"
				>
					<v-icon>mdi-download</v-icon>
				</v-btn>
				<v-btn
					icon
					variant="text"
					density="comfortable"
					:loading="deleteLoading"
					:disabled="deleteLoading"
					@click="removeFile"
				>
					<v-icon color="error">mdi-delete</v-icon>
				</v-btn>
			</div>

			<template v-else>
				<v-hover v-slot="{ isHovering, props: hoverProps }">
					<div
						v-bind="hoverProps"
						class="pb-file-dropzone"
						:class="{'pb-file-dropzone-hover': isHovering}"
						@click="triggerFileSelect"
						@drop.prevent="handleDrop"
						@dragover.prevent
					>
						<v-progress-circular v-if="loading" indeterminate color="primary" size="28"/>
						<template v-else>
							<v-icon size="28" color="primary">mdi-tray-arrow-up</v-icon>
							<span class="text-caption text-center mt-1">{{ t(AppLabels.EBOOK_FILE_DRAG_AND_DROP) }}</span>
						</template>
					</div>
				</v-hover>
				<div class="text-caption mt-1" style="text-align: center; width: 100%; color: var(--pb-text-muted)">
					{{ t(AppLabels.EBOOK_FILE_HOVER_INFO) }}
				</div>
			</template>

			<input
				ref="fileInput"
				type="file"
				accept=".epub,.pdf"
				style="display: none"
				@change="handleFileSelect"
			/>
		</template>
	</card-component>
</template>

<script setup lang="ts">
/**
 * Backed-up epub/pdf file for a book, shown on the book detail view: click
 * or drag-and-drop a file to upload it (via `Book.uploadFile`), or download
 * / delete the currently backed-up file.
 */
import Book from "@/model/book/Book";
import CardComponent from "@/components/card/CardComponent.vue";
import {computed, ref, Ref} from "vue";
import {useI18n} from "vue-i18n";
import {AppLabels} from "@/plugins/i18n/AppLabels";
import {PATH_PREFIX} from "@/Constants";
import {confirmationDialogController} from "@/components/confirmationDialog/ConfirmationDialogController";
import {appSnackbarController, SnackbarType} from "@/components/appSnackbar/AppSnackbarController";

const {t} = useI18n();

interface Props {
	book: Book;
}

const props = defineProps<Props>();

const loading: Ref<boolean> = ref(false);
const deleteLoading: Ref<boolean> = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB, matches the server-side limit

const file = computed(() => props.book.getFile());

const downloadUrl = computed(() => `${PATH_PREFIX}/book/${props.book.getId()}/file/download`);

const formattedSize = computed(() => {
	if (!file.value) return "";
	const kb = file.value.file_size / 1024;
	return kb < 1024 ? `${kb.toFixed(0)} KB` : `${(kb / 1024).toFixed(1)} MB`;
});

const formattedDate = computed(() => {
	return file.value ? new Date(file.value.date_created).toLocaleDateString() : "";
});

const triggerFileSelect = () => {
	fileInput.value?.click();
};

const handleFileSelect = (event: Event) => {
	const target = event.target as HTMLInputElement;
	if (target.files && target.files[0]) {
		loadFile(target.files[0]);
	}
	target.value = "";
};

const handleDrop = (event: DragEvent) => {
	const files = event.dataTransfer?.files;
	if (files && files[0]) {
		loadFile(files[0]);
	}
};

async function loadFile(selectedFile: File) {
	const name = selectedFile.name.toLowerCase();
	if (!name.endsWith(".epub") && !name.endsWith(".pdf")) {
		appSnackbarController.show({message: t(AppLabels.ONLY_EBOOK_FILES_ALLOWED), type: SnackbarType.ERROR});
		return;
	}

	if (selectedFile.size > MAX_FILE_SIZE) {
		appSnackbarController.show({message: t(AppLabels.FILE_TOO_LARGE), type: SnackbarType.ERROR});
		return;
	}

	try {
		loading.value = true;
		await props.book.uploadFile(selectedFile);
	} finally {
		loading.value = false;
	}
}

async function removeFile() {
	confirmationDialogController.showDialog(
		t(AppLabels.DELETE_FILE),
		t(AppLabels.DELETE_FILE_DESC),
		t(AppLabels.DELETE)
	).then(async () => {
		try {
			deleteLoading.value = true;
			await props.book.removeFile();
		} finally {
			deleteLoading.value = false;
		}
	})
}
</script>

<style scoped>
.pb-file-dropzone {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 16px;
	border: 1px dashed var(--pb-border);
	border-radius: var(--pb-radius);
	cursor: pointer;
}

.pb-file-dropzone-hover {
	background-color: rgba(var(--v-theme-primary), 0.08);
}
</style>
