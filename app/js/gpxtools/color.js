
function colorFromRamp(ramp, value, rgba, alpha) {
	if (ramp.length === 0) {
		return '#FF00FF';
	}

	if (value <= ramp[0].value) {
		if (rgba === true) {
			return createRGBA(ramp[0].color, alpha);
		} else {
			return ramp[0].color;
		}
	}

	if (value >= ramp[ramp.length - 1].value)
		if (rgba === true)
			return createRGBA(ramp[ramp.length - 1].color, alpha);
		else
			return ramp[ramp.length - 1].color;

	for (var i = 1; i <= ramp.length; i++) {
		if (ramp[i-1].value < value && ramp[i].value >= value) {
			return lerpColor(ramp[i-1].color, ramp[i].color, ramp[i-1].value, ramp[i].value, value, rgba, alpha);
		}
	}

	// fallback
	return '#FF00FF';
}

function createRGBA(color,alpha) {
	c = 'rgba(';
	for(var i=1; i <= 6; i+=2){
		var val = Math.floor(colorUtils.h2d(color.substr(i,2)));
		c += '' + val + ',';
	}
	c += alpha + ')';
	return c;
}

var colorUtils = {
    d2h: function(d) {return d.toString(16);},
    h2d: function(h) {return parseInt(h,16);}
}

function lerpColor(minColor, maxColor, from, to, value, rgba, alpha) {

    if(value < from){
		if (rgba === true)
			return createRGBA(minColor, alpha);
		else
			return minColor;
    }
    if(value > to){
		if (rgba === true)
			return createRGBA(maxColor, alpha);
		else
			return maxColor;
    }

	var color = '';
	if (rgba === true) {
		color = 'rgba(';
		for(var i=1; i <= 6; i+=2){
			var minVal = colorUtils.h2d(minColor.substr(i,2));
			var maxVal = colorUtils.h2d(maxColor.substr(i,2));
			var nVal = minVal + (maxVal-minVal) * ((value - from) / (to - from));
			var val = Math.floor(nVal);
			color += '' + val + ',';
		}
		color += alpha + ')';
	} else {
		color = '#';

		for(var i=1; i <= 6; i+=2){
			var minVal = colorUtils.h2d(minColor.substr(i,2));
			var maxVal = colorUtils.h2d(maxColor.substr(i,2));
			var nVal = minVal + (maxVal-minVal) * ((value - from) / (to - from));
			var val = colorUtils.d2h(Math.floor(nVal));
			while(val.length < 2){
				val = "0"+val;
			}
			color += val;
		}
	}
    return color;
}


