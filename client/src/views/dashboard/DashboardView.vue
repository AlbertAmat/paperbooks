<template>
	<page-component :model="controller">
		<v-row
			no-gutters
			class="mt-3"
			style="height: 100%"
		>
			<v-col cols="9" class="pl-0 pr-2">
				<v-row no-gutters class="pa-0">
					<v-col cols="4"  class="px-1 pb-1">
						<dashboard-card title="Overview" class="gradient">xxx</dashboard-card>
					</v-col>

					<v-col cols="4" class="px-1 pb-1">
						<dashboard-card title="Categories">xxx</dashboard-card>
					</v-col>

					<v-col cols="4" class="px-1 pb-1">
						<dashboard-card title="Customers">xxx</dashboard-card>
					</v-col>

					<v-col cols="12" class="px-1 pt-1">
						<dashboard-card title="Chart">
							<books-in-time-chart :data="controller.getBooksInTime()"/>
						</dashboard-card>
					</v-col>
				</v-row>

			</v-col>

			<v-col class="pl-2 pr-0">
				<dashboard-card title="Last books" style="height: 100%">
					xxxx
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

const controller = new DashboardController();

</script>
