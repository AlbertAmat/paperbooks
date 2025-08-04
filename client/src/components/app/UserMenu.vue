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
						:src="user.getImage()"
						style="width: 100%; height: 100%; object-fit: cover"
					/>
					<v-icon v-else dark>mdi-account</v-icon>
				</v-avatar>

				{{user.getName()}}
			</v-btn>
		</template>
		<v-card width="250px">
			<v-list nav class="py-0">
				<v-list-item
					v-for="(item, index) in items"
					:to="item.to"
					:href="item.href"
					:key="index"
					:value="index"
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

const items = [
	{
		title: "Settings",
		to: settingsRoute.getPath()
	},
	{
		title: "Log out",
		href: window.location.origin + "/logout"
	},
]

const user = applicationService.getUser();
</script>

<style scoped>

</style>