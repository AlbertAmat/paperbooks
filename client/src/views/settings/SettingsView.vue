<template>
	<page-component :model="controller">
		<template v-slot:append>
			<v-btn
				@click="save()"
				:loading="saving"
				:disabled="disableSave"
				class="gradient text-none"
			>
				Save
			</v-btn>
		</template>
		<template v-slot:default>
			<div style="height: 100%; width: 100%; padding-top: 10px;">
				<settings-card title="My Profile">
					<div style="display: flex; margin-bottom: 30px">
						<v-avatar
							class="mr-6"
							size="70"
							color="primary"
						>
							<img
								v-if="controller.getUser().hasImage()"
								:src="controller.getUser().getImage()"
								style="width: 100%; height: 100%; object-fit: cover"
							/>
							<v-icon v-else dark size="30">mdi-account</v-icon>
						</v-avatar>
						<div>
							<div class="d-flex">
								<v-btn
									@click="changeImage()"
									:loading="uploadingImage"
									:disabled="uploadingImage"
									variant="tonal"
									class="gradient text-none"
								>
									Change image
								</v-btn>
								<v-btn
									@click="removeImage"
									:loading="deletingImage"
									:disabled="deletingImage"
									variant="tonal"
									class="ml-4 text-none"
								>
									Remove image
								</v-btn>

								<!-- hidden input-->
								<input type="file" id="fileInput" accept="image/png, image/jpeg" style="display: none">
							</div>
							<p class="v-card-subtitle pl-0 mt-2">We only support PNGs, JPGs under 2MB</p>
						</div>
					</div>
					<div style="width: 100%; display: flex">
						<v-text-field
							:model-value="controller.getUser().getCode()"
							label="Code"
							density="compact"
							variant="outlined"
							readonly
							disabled
							hide-details
							class="mr-2 settings-filed"
						></v-text-field>

						<v-text-field
							v-model="name"
							label="Name"
							density="compact"
							variant="outlined"
							hide-details
							class="ml-2 settings-filed"
						></v-text-field>
					</div>
				</settings-card>

				<settings-card title="Language & Region">
					<div style="width: 100%; display: flex">
						<v-select
							v-model="language"
							:items="supportedLanguages"
							item-value="value"
							item-title="text"
							label="Language"
							density="compact"
							variant="outlined"
							hide-details
							class="mr-2 settings-filed"
						></v-select>

						<v-select
							v-model="region"
							:items="regions"
							item-value="code"
							item-title="region"
							label="Regions"
							density="compact"
							variant="outlined"
							hide-details
							class="ml-2 settings-filed"
						></v-select>
					</div>
				</settings-card>
				<settings-card title="Account Security">
					<v-text-field
						v-model="email"
						label="Email"
						density="compact"
						variant="outlined"
						hide-details
						class="mb-4  settings-filed"
					></v-text-field>

					<div style="display: flex; align-items: center; width: 100%; min-width: 0">
						<div style="flex: 1; padding-right: 80px">
							<p style="font-size: 14px; font-weight: 530">Change password</p>
							<p
								class="v-card-subtitle pl-0"
								style="white-space: normal"
							>
								Update your account password to keep your account secure. You’ll need to enter your
								current password and choose a new one that meets security requirements.
							</p>
						</div>
						<change-password-dialog :controller="controller"/>
					</div>
				</settings-card>

				<settings-card title="Settings">
					<div style="display: flex; align-items: center">
						<div style="flex: 1; min-width: 0">
							<p style="color: #c62f2f; font-weight: 530">Delete my account</p>
							<p
								class="v-card-subtitle pl-0"
								style="white-space: normal"
							>
								Permanently delete the account and remove workspace and books.
							</p>
						</div>
						<v-btn
							@click="deleteUser()"
							:loading="loadingDelete"
							:disabled="loadingDelete"
							variant="tonal"
							color="error"
							class="text-none"
						>
							Delete account
						</v-btn>
					</div>
				</settings-card>
			</div>
		</template>
	</page-component>
</template>

<script setup lang="ts">
import PageComponent from "@/views/PageComponent.vue";
import SettingsController from "@/controller/settings/SettingsController";
import {Ref, ref, computed} from "vue";
import SettingsCard from "@/views/settings/SettingsCard.vue";
import {confirmationDialogController} from "@/components/confirmationDialog/ConfirmationDialogController";
import ChangePasswordDialog from "@/views/settings/ChangePasswordDialog.vue";

const controller = new SettingsController();

/**
 *
 */
const saving: Ref<boolean> = ref(false);

/**
 *
 */
const deletingImage: Ref<boolean> = ref(false);

/**
 *
 */
const uploadingImage: Ref<boolean> = ref(false);

/**
 *
 */
const loadingDelete: Ref<boolean> = ref(false);

const name: Ref<string> = ref(controller.getUser().getName());
const email: Ref<string> = ref(controller.getUser().getEmail());
const language: Ref<string> = ref(controller.getUser().getLanguage());
const region: Ref<string> = ref(controller.getUser().getRegion());

// TODO: USE system_languages table
const supportedLanguages = [
	{text: "English", value: "en"},
	{text: "Spanish", value: "es"},
	{text: "Catalan", value: "ca"},
	{text: "Italian", value: "it"},
]

const regions = [
	{"code": "AU", "region": "Australia"},
	{"code": "BR", "region": "Brazil"},
	{"code": "CA", "region": "Canada"},
	{"code": "CN", "region": "China"},
	{"code": "FR", "region": "France"},
	{"code": "DE", "region": "Germany"},
	{"code": "IT", "region": "Italy"},
	{"code": "JP", "region": "Japan"},
	{"code": "MX", "region": "Mexico"},
	{"code": "PT", "region": "Portugal"},
	{"code": "RU", "region": "Russia"},
	{"code": "SA", "region": "Saudi Arabia"},
	{"code": "ES", "region": "Spain"},
	{"code": "TW", "region": "Taiwan"},
	{"code": "GB", "region": "United Kingdom"},
	{"code": "US", "region": "United States"}
]

const disableSave = computed(() => {
	const empty = name.value.trim().length === 0 || email.value.trim().length === 0 || language.value.trim().length === 0 || saving.value;

	const user = controller.getUser();
	const equal = name.value === user.getName() && email.value === user.getEmail() && language.value === user.getLanguage() && region.value === user.getRegion();

	return empty || equal;
})

async function save() {
	try {
		saving.value = true;
		await controller.getUser().update(
			name.value,
			email.value,
			language.value,
			region.value
		)
	} finally {
		saving.value = false;
	}
}

async function removeImage() {
	try {
		deletingImage.value = true;
		await controller.getUser().removeImage();
	} finally {
		deletingImage.value = false;
	}
}

async function deleteUser() {
	confirmationDialogController.showDialog(`Delete user`, "Are you sure you want to delete your Paper Books account?\n" +
		"This will permanently remove your account and all associated content.", "Delete").then(async () => {
		try {
			loadingDelete.value = true;
			await controller.getUser().delete();
		} finally {
			loadingDelete.value = false;
		}
	})
}

function changeImage() {
	const input = document.getElementById('fileInput');

	if (input) {
		// Trigger the file dialog
		input.click();

		// Listen for file selection
		input.onchange = async function (event: any) {
			const file = event.target.files?.[0]; // Optional chaining

			if (!file) return; // No file selected

			if (file.type !== "image/png" && file.type !== "image/jpeg") {
				alert("Please upload a PNG or JPEG image.");
				event.target.value = ""; // Clear the input
				return;
			}

			if (file.size > 2 * 1024 * 1024) {
				alert("File size must be less than 2MB.");
				event.target.value = ""; // Clear the input
				return;
			}

			// Call your upload logic
			try {
				uploadingImage.value = true;
				await controller.getUser().uploadImage(file);
			} finally {
				uploadingImage.value = false;
			}
		};
	}
}
</script>

<style scoped>
.settings-filed {
	width: 50%;
}
</style>