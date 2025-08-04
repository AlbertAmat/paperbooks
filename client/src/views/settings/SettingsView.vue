<template>
	<page-component :model="controller">
		<template v-slot:append>
			<v-btn
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
								<v-btn variant="tonal" class="gradient text-none">Change image</v-btn>
								<v-btn variant="tonal" class="ml-4 text-none">Remove image</v-btn>
							</div>
							<p class="v-card-subtitle pl-0 mt-2">We only support PNGs under 2MB</p>
						</div>
					</div>
					<v-text-field
						v-model="name"
						label="Name"
						density="compact"
						variant="outlined"
						hide-details
						class="mb-4"
					></v-text-field>
				</settings-card>

				<settings-card title="Language & Region">
					<v-select
						v-model="language"
						:items="supportedLanguages"
						item-value="value"
						item-title="text"
						label="Language"
						density="compact"
						variant="outlined"
						hide-details
						class="mb-4"
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
						class="mb-4"
					></v-select>
				</settings-card>
				<settings-card title="Account Security">
					<v-text-field
						v-model="email"
						label="Email"
						density="compact"
						variant="outlined"
						hide-details
						class="mb-4"
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
						<v-btn variant="tonal" class="text-none">Change password</v-btn>
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
						<v-btn variant="tonal" color="error" class="text-none">Delete account</v-btn>
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

const controller = new SettingsController();

const name: Ref<string> = ref(controller.getUser().getName());
const email: Ref<string> = ref(controller.getUser().getEmail());
const language: Ref<string> = ref(controller.getUser().getLanguage());
const region: Ref<string> = ref(controller.getUser().getRegion());
const image: Ref<string | null> = ref(controller.getUser().getImage());

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
	return name.value.trim().length === 0 || email.value.trim().length === 0 || language.value.trim().length === 0
})
</script>