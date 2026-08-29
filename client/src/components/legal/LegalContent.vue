<template>
	<div class="legal-content">
		<template v-for="(block, index) in blocks" :key="index">
			<h3 v-if="block.type === 'heading'">{{ block.text }}</h3>

			<p v-else-if="block.type === 'paragraph'">{{ block.text }}</p>

			<ul v-else-if="block.type === 'list'">
				<li v-for="(item, itemIndex) in block.items" :key="itemIndex">{{ item }}</li>
			</ul>

			<table v-else-if="block.type === 'table'">
				<thead>
					<tr>
						<th v-for="(header, headerIndex) in block.headers" :key="headerIndex">{{ header }}</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(row, rowIndex) in block.rows" :key="rowIndex">
						<td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
					</tr>
				</tbody>
			</table>
		</template>
	</div>
</template>

<script setup lang="ts">
import {LegalBlock} from "@/views/legal/legalTypes";

interface Props {
	blocks: LegalBlock[]
}

defineProps<Props>()
</script>

<style scoped lang="scss">
.legal-content {
	max-width: 820px;

	h3 {
		margin-top: 24px;
		margin-bottom: 8px;
		font-size: 16px;
	}

	p {
		margin-bottom: 12px;
		line-height: 1.6;
	}

	ul {
		margin: 0 0 12px 20px;

		li {
			margin-bottom: 4px;
			line-height: 1.6;
		}
	}

	table {
		width: 100%;
		border-collapse: collapse;
		margin-bottom: 16px;

		th, td {
			text-align: left;
			padding: 8px 12px;
			border: 1px solid rgba(0, 0, 0, 0.12);
			vertical-align: top;
		}

		th {
			background-color: rgba(0, 0, 0, 0.04);
		}
	}
}
</style>
