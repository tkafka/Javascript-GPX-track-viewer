/*global $ */

var draw_slope = false;
var draw_profile = false;

function set_feature(bool, id, callback) {
	var el = $('#' + id);
	if (bool) {
		$('body').addClass(id);
		if (callback != null)
			callback(el);
	} else {
		$('body').removeClass(id);
	}
}

$(document).ready(function () {
	var updateLayout = function() {
		// height
		var height = $(window).height();
		var profileHeight = draw_profile ? $('#profilegraph').height() : 0;
		$('#mapwrapper').height(height - profileHeight);
		$('#slopevis').height(height - profileHeight);

		// height
		var width = $(window).width();
		var slopeWidth = draw_slope ? $('#slopevis').width() : 0;
		$('#mapwrapper').width(width- slopeWidth);
	};

	var speedramp = [
		{value: 0,  color: '#0000FF'},
		{value: 20, color: '#FF0000'},
		{value: 30, color: '#FF8000'},
		{value: 40, color: '#FFFF00'},
		{value: 60, color: '#00FF00'}
	];
	var sloperamp = [
		{value: -15,  color: '#008000'},
		{value: -8,  color: '#00FF00'},
		{value: 0,  color: '#FFFF00'},
		{value: 8, color: '#FF0000'},
		{value: 15, color: '#800000'}
	];
	writeLegend(speedramp);

	var map = createMap('map');
	var parser = createParser(map, speedramp, sloperamp);

	var slopevis;
	var profilevis;

	$('body').initDrop(function (droppedFileContent, filename) {
		$('#dropalert').remove();
		
		document.title = 'GPX: ' + filename;

		var gpxData = parser.ParseGpx(droppedFileContent);
		
		// decide to draw stuff:
		if (gpxData.tracks.length == 0) {
			// just routes or nothing
			draw_slope = false;
			draw_profile = false;
			
			/*
			if (gpxData.routes.length > 0) {
				if (gpxData.routes[0].hasElevation) {
					
				}
			}
			*/
		} else {
			draw_slope = true;
			draw_profile = true;
		}
		// and update containsers
		set_feature(draw_slope, 'slopevis', function(el){ slopevis = new SlopeVisualizer(el); });
		set_feature(draw_profile, 'profilegraph', function(el){ profilevis = new ProfileVisualizer(el); });
		updateLayout();
		
		parser.DrawGpx(gpxData, null, true, true);

		if (draw_slope)
			slopevis.drawGpx(gpxData);

		if (draw_profile)
			profilevis.drawGpx(gpxData);
	});

	// layout
	var resizeTimer = null;
	$(window).bind('resize', function() {
		//if (resizeTimer) clearTimeout(resizeTimer);
		//resizeTimer = setTimeout(updateLayout, 50);
		updateLayout();
	});

});

function writeLegend(ramp) {
	var out = '';
	for(i=0; i<ramp.length; i++) {
		out += ' <b style="color: ' + ramp[i].color + '">';
		out += ramp[i].value;
		out += '</b>';
	}
	$('#promo').append('<p class="main-legend">Speed: ' + out + '</p>');
}

function createMap(mapElementId) {
	var map = new GMap2(document.getElementById(mapElementId));
	map.addMapType(G_PHYSICAL_MAP);
	map.setMapType(G_PHYSICAL_MAP);
	map.addControl(new GLargeMapControl());
	map.addControl(new GMapTypeControl());
	return map;
}

function createParser(map, speedramp, sloperamp) {
	var parser = new GPXParser(map);
	var coloring = 'speed';
	//var coloring = 'slope';

	parser.SetSegmentColorProvider(function(p1, p2) {
		switch (coloring) {
			case 'speed':
				if (p2.spd != p2.spd) { // aka not a number
					return '#FF00FF';
				}
				return colorFromRamp(speedramp, p2.spd);
				break;
			case 'slope':
				if (p2.elediff != p2.elediff
					|| p2.dst != p2.dst
					) { // aka not a number
					return '#FF00FF';
				}
				var angle = Math.atan2(p2.elediff, p2.dst * 1000) * 180 / Math.PI; // <-180 - 180>
				return colorFromRamp(sloperamp, angle);
				break;
			default:
				return '#FF00FF';
				break;
		}

	});
	parser.SetTrackWidth(4);
	// parser.SetMaxTrackPointDelta(0);

	return parser;
}


