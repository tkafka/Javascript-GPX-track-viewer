// see http://www.william-map.com/20100325/1/map.htm

/* -------------------------------------------
 * DotMarker
 *
 * A simple marker class using 7x7 dot images
 *
 * Derived from:
 *
 *   BdccBlock    http://www.bdcc.co.uk/Gmaps/BdccGmapBits.htm
 *   IconOverlay  http://www.marsrutai.info/stops
 *
 * Constructor DotMarker(point, image, info)
 *
 *   point: GLatLng
 *   image: url to image
 *   info:  array of information; first element is tooltip
 *
 * -------------------------------------------*/

function DotMarker(point, image, info) {
  this.point_ = point;
  this.image_ = image
  this.info_  = info;
}

DotMarker.prototype = new GOverlay();

DotMarker.prototype.initialize = function(map) {

  var div = document.createElement("DIV");
  div.style.position = "absolute";
  div.style.width = "7px";
  div.style.height = "7px";
  div.style.overflow = "hidden";
  div.style.background = "url(" + this.image_ + ")";
  if (this.info_ != null){
      div.title = this.info_[0];
  }

  try { div.style.cursor='pointer'; } catch(e) { }

  GEvent.bindDom(div, 'click', this, function() { GEvent.trigger(this, 'click', this) });

  map.getPane(G_MAP_MARKER_PANE).appendChild(div);

  this.map_ = map;
  this.div_ = div;
}

DotMarker.prototype.remove = function() {
  this.div_.parentNode.removeChild(this.div_);
}

DotMarker.prototype.copy = function() {
  return new DotMarker(this.point_, this.image_, this.info_);
}

DotMarker.prototype.redraw = function(force) {
  if (!force) return;

  var p = this.map_.fromLatLngToDivPixel(this.point_);

  this.div_.style.left = (p.x-3) + "px";
  this.div_.style.top  = (p.y-3) + "px";
}

/* -------------------------------------------*/

/*

function initialize() {

  if (GBrowserIsCompatible()) {

    var map = new GMap2(document.getElementById("map_canvas"));
    map.setCenter(new GLatLng(38,-96),4);
    map.setUIToDefault();

    var markers = [];
    for (var i=0; i<airports.length; i++) {

      var pt = new GLatLng(airports[i].y, airports[i].x);

      var color =  airports[i].p.length > 0 ? airports[i].n.indexOf("Intl") > 0 || airports[i].n.indexOf("International") > 0 ? "blue" : "red" : "yellow";

      markers[i] = new DotMarker(pt, color + ".gif", [airports[i].n, airports[i].p]);

      GEvent.addListener(markers[i], "click", function(m) {
        var html;
        if (m.info_[1].length > 0) {
          html = '<div style="width:233px; height:200px; overflow:hidden">';

          html += '<a href="http://www.airstripamerica.com" target="_blank">';
          html += '<img width="223" height="37" src="aa_logo.jpg" style="border-style: none"/></a>';

          html += '<br><span style="font:14px Arial;"><b>' + m.info_[0] + '</b></span>';

          var url = "http://www.airstripamerica.com/Photos/" + m.info_[1].substring(0,1) + "/" + m.info_[1];
          html += '<br><img width="223px" src="' + url + '" style="border-style: none"/></div>';
        } else {
          html = '<span style="font:14px Arial;"><b>' + m.info_[0] + '</b></span>';
        }
        map.openInfoWindowHtml(m.point_, html);
      });

      map.addOverlay(markers[i]);
    }
  }
}

*/
