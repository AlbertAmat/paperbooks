<template>
	<v-menu>
		<template v-slot:activator="{ props }">
			<v-btn
				v-bind="props"
				variant="text"
				class="d-flex align-center ml-3 text-none px-0"
			>
				<v-avatar
					class="mr-2"
					size="30"
					color="primary"
				>
					<img
						v-if="user.hasImage()"
						:src="user.getImage() || ''"
						style="width: 100%; height: 100%; object-fit: cover"
					/>
					<v-icon v-else dark>mdi-account</v-icon>
				</v-avatar>

				{{user.getName()}}
			</v-btn>
		</template>
		<v-card width="250px">
			<v-card-title class="d-flex align-center py-0 pl-2">
				<v-avatar
					class="mr-3"
					size="30"
					color="primary"
				>
					<img
						v-if="user.hasImage()"
						:src="user.getImage()"
						style="width: 100%; height: 100%; object-fit: cover"
					/>
					<v-icon v-else dark size="30">mdi-account</v-icon>
				</v-avatar>
				<div>
					<span style="font-size: 14px">{{user.getName()}}</span>
					<span class="v-card-subtitle pl-0" style="font-size: 12px">{{user.getEmail()}}</span>
				</div>
			</v-card-title>
			<v-list nav slim class="pa-0">
				<v-list-item
					v-for="(item, index) in items"
					:to="item.to"
					:href="item.href"
					:key="index"
					:value="index"
					density="compact"
					class="py-0"
					nav
				>
					<v-list-item-title>{{ item.title }}</v-list-item-title>
				</v-list-item>
			</v-list>
		</v-card>
	</v-menu>
</template>

<script setup lang="ts">

import {settingsRoute} from "@/router/routes/SettingsRoute";
import {applicationService} from "@/service/ApplicationService";
import {useI18n} from "vue-i18n";
import {AppLabels} from "@/plugins/i18n/AppLabels";

const {t} = useI18n();

const items = [
	{
		title: t(AppLabels.SETTINGS),
		to: settingsRoute.getPath()
	},
	{
		title: t(AppLabels.LOG_OUT),
		href: window.location.origin + "/logout"
	},
]

const user = applicationService.getUser();
</script>