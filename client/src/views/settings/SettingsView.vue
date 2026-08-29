<template>
	<page-component :model="controller">
		<template v-slot:append>
			<v-btn
				@click="save()"
				:loading="saving"
				:disabled="disableSave"
				color="primary"
				variant="elevated"
				class="text-none"
			>
				{{t(AppLabels.SAVE)}}
			</v-btn>
		</template>
		<template v-slot:default>
			<div style="height: 100%; width: 100%; padding-top: 10px;">
				<settings-card :title="t(AppLabels.USERCONF_MY_PROFILE)">
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
									class="text-none"
								>
									{{t(AppLabels.USERCONF_CHANGE_IMAGE)}}
								</v-btn>
								<v-btn
									@click="removeImage"
									:loading="deletingImage"
									:disabled="deletingImage"
									variant="tonal"
									class="ml-4 text-none"
								>
									{{ t(AppLabels.USERCONF_REMOVE_IMAGE) }}
								</v-btn>

								<!-- hidden input-->
								<input type="file" id="fileInput" accept="image/png, image/jpeg" style="display: none">
							</div>
							<p class="v-card-subtitle pl-0 mt-2">{{t(AppLabels.USERCONF_IMAGE_SUPPORT)}}</p>
						</div>
					</div>
					<div style="width: 100%; display: flex">
						<v-text-field
							:model-value="controller.getUser().getCode()"
							:label="t(AppLabels.CODE)"
							density="compact"
							variant="outlined"
							readonly
							disabled
							hide-details
							class="mr-2 settings-filed"
						/>

						<v-text-field
							v-model="name"
							:label="t(AppLabels.USERCONF_NAME)"
							density="compact"
							variant="outlined"
							hide-details
							class="ml-2 settings-filed"
						/>
					</div>
				</settings-card>

				<settings-card :title="t(AppLabels.USERCONF_LANGUAGE_REGION)">
					<div style="width: 100%; display: flex">
						<v-select
							v-model="language"
							:items="supportedLanguages"
							item-value="value"
							item-title="text"
							:label="t(AppLabels.USERCONF_LANGUAGE)"
							density="compact"
							variant="outlined"
							hide-details
							class="mr-2 settings-filed"
						/>

						<v-select
							v-model="region"
							:items="regions"
							item-value="code"
							item-title="region"
							:label="t(AppLabels.USERCONF_REGION)"
							density="compact"
							variant="outlined"
							hide-details
							class="ml-2 settings-filed"
						/>
					</div>
				</settings-card>
				<settings-card :title="t(AppLabels.USERCONF_ACCOUNT_SECURITY)">
					<v-text-field
						v-model="email"
						:label="t(AppLabels.USERCONF_EMAIL)"
						density="compact"
						variant="outlined"
						hide-details
						class="mb-4  settings-filed"
					/>

					<div style="display: flex; align-items: center; width: 100%; min-width: 0">
						<div style="flex: 1; padding-right: 80px">
							<p style="font-size: 14px; font-weight: 530">{{t(AppLabels.USERCONF_CHANGE_PASSWORD)}}</p>
							<p
								class="v-card-subtitle pl-0"
								style="white-space: normal"
							>
								{{t(AppLabels.USERCONF_CHANGE_PASSWORD_DESC)}}
							</p>
						</div>
						<change-password-dialog :controller="controller"/>
					</div>

					<div style="display: flex; align-items: center; margin-top: 16px">
						<div style="flex: 1; min-width: 0">
							<p style="color: #c62f2f; font-weight: 530">{{t(AppLabels.USERCONF_DELETE)}}</p>
							<p
								class="v-card-subtitle pl-0"
								style="white-space: normal"
							>
								{{t(AppLabels.USERCONF_DELETE_DESC)}}
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
							{{t(AppLabels.USERCONF_DELETE)}}
						</v-btn>
					</div>
				</settings-card>
			</div>
		</template>
	</page-component>
</template>

<script setup lang="ts">
/**
 * Account settings view: profile picture, name/email/language/region form
 * (save is disabled until a field actually differs from the loaded user),
 * password change (`ChangePasswordDialog`), and account deletion.
 */
import PageComponent from "@/views/PageComponent.vue";
import SettingsController from "@/controller/settings/SettingsController";
import {Ref, ref, computed} from "vue";
import SettingsCard from "@/views/settings/SettingsCard.vue";
import {confirmationDialogController} from "@/components/confirmationDialog/ConfirmationDialogController";
import ChangePasswordDialog from "@/views/settings/ChangePasswordDialog.vue";
import {AppLabels} from "@/plugins/i18n/AppLabels";
import {useI18n} from "vue-i18n";

const controller = new SettingsController();

const {t} = useI18n();

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
	confirmationDialogController.showDialog(
		t(AppLabels.USERCONF_DELETE_USER_TITLE),
		t(AppLabels.USERCONF_DELETE_USER_DESC),
		t(AppLabels.DELETE)
	).then(async () => {
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
				alert(t(AppLabels.USERCONF_IMAGE_FORMAT_ALERT));
				event.target.value = ""; // Clear the input
				return;
			}

			if (file.size > 2 * 1024 * 1024) {
				alert(t(AppLabels.USERCONF_IMAGE_SIZE_ALERT));
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