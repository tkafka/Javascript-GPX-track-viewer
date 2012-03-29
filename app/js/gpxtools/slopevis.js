function SlopeVisualizer(jqelement)
{
	this.jqelement = jqelement;
	this.buckets = 5;
	this.ramp = [
		{value: 0, color: '#00FF00'},
		{value: 1.5, color: '#FFFF00'},
		{value: 3, color: '#FF8000'},
		{value: 5, color: '#FF0000'}
	];
}

SlopeVisualizer.prototype._computeSlope = function(elediff, dist) {
	var angle = Math.atan2(elediff, dist * 1000) * 180 / Math.PI; // <-180 - 180>
	return angle;
}

SlopeVisualizer.prototype.drawGpx = function(gpxdata) {
	var that = this;
	var titleForBucket = function(bucket) {
		return '' + Math.round(100 * bucket / that.buckets) + '-' + Math.round(100 * (bucket + 1) / that.buckets) + '% of track';
	}
	var colorForBucket = function(bucket) {
		var c = colorFromRamp(that.ramp, bucket, true, 0.3);
		console.debug(c);
		return c;
		//var brightness = Math.round(192 * bucket / that.buckets);
		//return 'rgba(' + brightness + ',' + brightness + ',' + brightness + ',0.2)';
	}
	var series = [];
	var currentBucket = 0;
	var bucketData = {
		name: titleForBucket(0),
		color: colorForBucket(0),
		data: []
	};

	func.map(gpxdata.tracks, this, function(track) {
		func.map(track.segments, this, function(segment) {
			if (track.segments.length > 0 && track.segments[0].points.length > 0) {
				var startTime = track.segments[0].points[0].time;
				var endTime = track.segments[track.segments.length - 1].points[track.segments[track.segments.length - 1].points.length - 1].time;
			}

			var lastTime = startTime;
			var bufferElediff = 0;
			var bufferDst = 0;
			var bufferCnt = 0;

			func.map(segment.points, this, function(point) {
				if (point.spd != undefined
					&& point.ele != undefined
					&& point.elediff != undefined
					&& point.dst != undefined)
				{
					bufferElediff += point.elediff;
					bufferDst += point.dst;

					if (++bufferCnt == 5) {
						var slope = Math.round(this._computeSlope(bufferElediff, bufferDst));
						var time = point.time - lastTime;
						var speed = bufferDst / time * 1000 * 60 * 60; // from km/ms to km/h
						speed = Math.round(speed * 10) / 10;

						// console.debug('time: ' + time + ' dist: ' + bufferDst);

						var bucket = Math.floor((point.time - startTime) / (endTime - startTime + 1) * this.buckets);

						if (bucket > currentBucket) {
							if (bucketData != null
								&& bucketData.data.length > 0) {
								// close bucket
								console.debug(bucketData);

								series.push(bucketData);
							}

							bucketData = {
								name: titleForBucket(bucket),
								color: colorForBucket(bucket),
								data: []
							};

							currentBucket = bucket;
						}

						bucketData.data.push([slope, speed]);

						bufferCnt = 0;
						bufferElediff = 0;
						bufferDst = 0;
						lastTime = point.time;
					}

					// segmentdata.data.push([point.time, point.ele]);
				}
			});

			series.push(bucketData);
		});
	});


	var regressions = [];
	func.map(series, this, function(bucketData) {
		var regression = {
			type: 'line',
			name: 'Regression for ' + bucketData.name,

		};
	});


	this._chartSeries(series);
}


SlopeVisualizer.prototype._chartSeries = function(seriesdata) {
	this.jqelement.html('');

	var chart = new Highcharts.Chart({
		chart: {
			renderTo: this.jqelement.attr('id'),
			type: 'scatter'
			//,zoomType: 'xy'
		},
		title: {
			text: ''
		},
		subtitle: {
			text: ''
		},
		xAxis: {
			title: {
				text: 'Slope (degrees)'
			},
			startOnTick: true,
			endOnTick: true,
			showLastLabel: true,
			showFirstLabel: true,
			min: -10,
			max: 10,
			gridLineColor: '#c0c0c0',
			gridLineWidth: 1
		},
		yAxis: {
			title: {
				text: 'Speed (km/h)'
			},
			min: 0,
			gridLineColor: '#c0c0c0',
			gridLineWidth: 1
		},
		tooltip: {
			formatter: function() {
				return this.x +'°: '+ this.y +' km/h';
			}
		},
		legend: {
			layout: 'vertical',
			align: 'center',
			verticalAlign: 'top',
			// x: 100,
			// y: 70,
			// floating: true,
			backgroundColor: '#FFFFFF',
			borderWidth: 0
		},
		plotOptions: {
			scatter: {
				marker: {
					radius: 3,
					states: {
						hover: {
							enabled: true,
							lineColor: 'rgb(100,100,100)'
						}
					}
				},
				states: {
					hover: {
						marker: {
							enabled: false
						}
					}
				}
			}
		},


		series: seriesdata
	});
}
