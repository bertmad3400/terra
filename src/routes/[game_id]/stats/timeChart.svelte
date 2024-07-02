<script lang="ts">
	import type { PlayerChartData } from '$lib/types';

	import { Axis, Bars, Chart, Svg, createStackData } from 'layerchart';

	import { scaleBand, scaleOrdinal } from 'd3-scale';
	import { extent } from 'd3-array';
	import { formatTime } from '$lib/common';

	export let playerData: PlayerChartData[];

	$: timeData = playerData.map((dataPoint) => ({ ...dataPoint, value: dataPoint.time }));

	$: groupedData = createStackData(timeData, {
		xKey: 'round',
		groupBy: 'name'
	});

	$: colorKeys = [...new Set(playerData.map((player) => player.id))];
	$: keyColors = colorKeys.map(
		(id) => playerData.find((player) => player.id === id)?.color ?? '#fff'
	);
</script>

<div class="h-[300px] p-4">
	<Chart
		data={groupedData}
		flatData={timeData}
		x="round"
		xScale={scaleBand().paddingInner(0.4).paddingOuter(0.1)}
		y="value"
		yDomain={extent(groupedData.flatMap((d) => d.values))}
		yNice={4}
		r={(d) => d}
		rScale={scaleOrdinal()}
		rDomain={colorKeys}
		rRange={keyColors}
		padding={{ left: 16, bottom: 24 }}
	>
		<Svg>
			<Axis placement="left" format={(seconds) => formatTime(seconds)} grid rule />
			<Axis placement="bottom" format={(round) => `Round ${round + 1}`} rule />
			<Bars groupBy="name" radius={4} strokeWidth={1} />
		</Svg>
	</Chart>
</div>
