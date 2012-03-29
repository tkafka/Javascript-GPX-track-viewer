var func = {
	/*
	Functional.js sucks heavily:
	Functional:
	map(
		function (track) { 
			map(
				function (segment) {
					map(
						function (point) {
							this.updateBounds(point);				
						},
						segment.points
					)
				},
				track.segments
			);
		},
		gpxdata.tracks
		);

	 
	This:
	map(gpxdata.tracks, this, function (track) {
		func.map(track.segments, this, function (segment) {
			func.map(segment.points, this, updateBounds);
		});
	});
	 */
	
	map: function(data, context, fn) {
		if (!func.isArray(data))
			throw 'func.map: first argument must be array.';

		// = arguments.splice(0, 3); if this was possible
		var args = [null];
		for (var i=3; i<arguments.length; i++)
			args.push(arguments[i]);

		for(var i=0; i<data.length; i++) {
			args[0] = data[i];
			fn.apply(context, args);
		}
	},

	isArray : function(obj) {
	   if (obj != undefined
		   && obj.constructor.toString().indexOf("Array") >= 0)
		  return true;
	   else
		  return false;
	},
	
	// reducer: list, element, context => list
	reduce = function(data, context, init, reducer) {
		if (!func.isArray(data))
			throw 'func.reduce: first argument must be array.';

		for(var i = 0; i < data.length; i++) {
			args[0] = data[i];
			init = fn.apply(context, [init, data[i], context]);
		}
		return init;
	}
	
	if (!Array.prototype.reduce)
	{
	  Array.prototype.reduce = function(fun /*, initial*/)
	  {
	    var len = this.length;
	    if (typeof fun != "function")
	      throw new TypeError();
	
	    // no value to return if no initial value and an empty array
	    if (len == 0 && arguments.length == 1)
	      throw new TypeError();
	
	    var i = 0;
	    if (arguments.length >= 2)
	    {
	      var rv = arguments[1];
	    }
	    else
	    {
	      do
	      {
	        if (i in this)
	        {
	          rv = this[i++];
	          break;
	        }
	
	        // if array contains no values, no initial value to return
	        if (++i >= len)
	          throw new TypeError();
	      }
	      while (true);
	    }
	
	    for (; i < len; i++)
	    {
	      if (i in this)
	        rv = fun.call(null, rv, this[i], i, this);
	    }
	
	    return rv;
	  };
	}
}

Object.prototype.isArray = function () {
	if (this !== undefined && this.constructor.toString().indexOf("Array") >= 0)
		return true;
	else
		return false;
}

	map: function(data, that, fn) {
		if (!func.isArray(data))
			throw 'GPXParser._map: first argument must be array.';

		// = arguments.splice(0, 3); if this was possible
		var args = [null];
		for (var i=3; i<arguments.length; i++)
			args.push(arguments[i]);

		for(var i=0; i<data.length; i++) {
			args[0] = data[i];
			fn.apply(that, args);
		}
	},

