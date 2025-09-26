<template>
	<div v-if="data && data.length">
		<LineChartComponent :data="chartData" :options="chartOptions"/>
	</div>
	<div v-else class="text-gray-500 text-sm">Loading chart...</div>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {
	Chart as ChartJS,
	Title,
	Tooltip,
	Legend,
	LineElement,
	PointElement,
	CategoryScale,
	LinearScale
} from 'chart.js';
import {Line as LineChartComponent} from 'vue-chartjs';
import {IBooksInTime} from "@/types/dashboard/IDashboard";
import {useI18n} from "vue-i18n";
import {AppLabels} from "@/plugins/i18n/AppLabels";

// Register Chart.js modules
ChartJS.register(
	Title,
	Tooltip,
	Legend,
	LineElement,
	PointElement,
	CategoryScale,
	LinearScale
);

const {t} = useI18n();

interface Props {
	data: IBooksInTime[];
}

const props = defineProps<Props>()

const chartData = computed(() => ({
	labels: props.data.map(item =>
		new Date(item.month).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short'
		})
	),
	datasets: [
		{
			label: t(AppLabels.DASHBOARD_BOOKS_ADDED_TIME_OVER_TIME),
			data: props.data.map(item => item.total_books),
			borderColor: '#1c7ff1',
			backgroundColor: '#1c7ff1',
			fill: false,
			tension: 0.3
		}
	]
}));

const chartOptions = {
	responsive: true,
	plugins: {
		legend: {display: true}
	},
	scales: {
		y: {beginAtZero: true}
	}
};
</script>
