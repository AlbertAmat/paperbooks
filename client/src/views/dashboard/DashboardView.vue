<template>
	<page-component :model="controller">
		<v-row
			no-gutters
			class="mt-3"
			style="height: 100%"
		>
			<v-col cols="9" class="pl-0 pr-0">
				<v-row no-gutters class="pa-0">
					<v-col cols="4" class="px-1 pb-1">
						<dashboard-card :title="t(AppLabels.OVERVIEW)" class="gradient">
							<h2>
								{{ controller.getTotalBooks() }}
								<v-icon
									size="18"
									:color="upBooksTrend ? 'green' : 'red'"
								>
									{{ upBooksTrend ? 'mdi-arrow-top-right' : 'mdi-arrow-bottom-left' }}
								</v-icon>
							</h2>
							<span class="v-card-subtitle pl-0 mt-1">{{t(AppLabels.TOTAL_BOOKS)}}</span>
						</dashboard-card>
					</v-col>

					<v-col cols="4" class="px-1 pb-1">
						<dashboard-card :title="t(AppLabels.BOOKED_BOOKS)">
							<div style="display:flex; width: 100%; align-items: center">
								<div style="flex: 1">
									<h2>{{ controller.getTotalBookedBooks() }}</h2>
									<span class="v-card-subtitle pl-0 mt-1">{{t(AppLabels.DASHBOARD_TOTAL)}}</span>
								</div>

								<v-btn
									class="text-none mr-2 gradient"
									small
									color="primary"
								>
									{{t(AppLabels.RELEASE)}}
								</v-btn>
							</div>
						</dashboard-card>
					</v-col>

					<v-col cols="4" class="px-1 pb-1">
						<dashboard-card :title="t(AppLabels.CATEGORIES)">
							<h2>{{ controller.getTotalCategories() }}</h2>
							<span class="v-card-subtitle pl-0 mt-1">{{t(AppLabels.DASHBOARD_TOTAL)}}</span>
						</dashboard-card>
					</v-col>

					<v-col cols="4" class="px-1 pb-1">
						<dashboard-card :title="t(AppLabels.CUSTOMERS)">
							<h2>{{ controller.getTotalCustomers() }}</h2>
							<span class="v-card-subtitle pl-0 mt-1">{{t(AppLabels.DASHBOARD_TOTAL)}}</span>
						</dashboard-card>
					</v-col>

					<v-col cols="4" class="px-1 pb-1">
						<dashboard-card :title="t(AppLabels.LOCATIONS)">
							<h2>{{ controller.getTotalLocations() }}</h2>
							<span class="v-card-subtitle pl-0 mt-1">{{t(AppLabels.DASHBOARD_TOTAL)}}</span>
						</dashboard-card>
					</v-col>

					<v-col cols="4" class="px-1 pb-1">
						<dashboard-card :title="t(AppLabels.AUTHORS)">
							<h2>{{ controller.getTotalAuthors() }}</h2>
							<span class="v-card-subtitle pl-0 mt-1">{{t(AppLabels.DASHBOARD_TOTAL)}}</span>
						</dashboard-card>
					</v-col>

					<v-col cols="12" class="px-1 pt-1">
						<dashboard-card :title="t(AppLabels.DASHBOARD_CHART)">
							<books-in-time-chart :data="controller.getBooksInTime()"/>
						</dashboard-card>
					</v-col>
				</v-row>
			</v-col>

			<v-col class="pl-1 pr-0">
				<dashboard-card :title="t(AppLabels.DASHBOARD_LAST_BOOKS)" style="height: 100%; max-height: 100%">
					<v-list slim style="padding: 0;">
						<v-list-item
							v-for="item in controller.getLastBooks()"
							:to="getBookUrl(item.id)"
							:title="item.name"
							:subtitle="item.isbn"
							class="px-2"
							nav
						>
							<template v-slot:prepend>
								<img
									v-if="item.image_url != null"
									:src="item.image_url"
									style="height: 40px; margin-right: 10px"
								/>
								<div
									v-else
									style="background-color: #f1f1f1; height: 40px; width: 30px; margin-right: 10px; display: flex; align-items: center; justify-content: center"
								>
									<v-icon>mdi-image-outline</v-icon>
								</div>
							</template>
						</v-list-item>
					</v-list>
				</dashboard-card>
			</v-col>
		</v-row>
	</page-component>
</template>

<script setup lang="ts">
import PageComponent from "@/views/PageComponent.vue";
import DashboardController from "@/controller/dashboard/DashboardController";
import DashboardCard from "@/views/dashboard/DashboardCard.vue";
import BooksInTimeChart from "@/views/dashboard/BooksInTimeChart.vue";
import {bookRoute} from "@/router/routes/BookRoute";
import {computed} from "vue";
import {useI18n} from "vue-i18n";
import {AppLabels} from "@/plugins/i18n/AppLabels";

const controller = new DashboardController();

const {t} = useI18n();

function getBookUrl(id: number) {
	return bookRoute.getPath(id)
}

const upBooksTrend = computed(() => controller.getTotalThisMonth() > controller.getTotalLastMonth())
</script>
