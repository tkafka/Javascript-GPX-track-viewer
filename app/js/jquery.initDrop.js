jQuery(document).ready(function () {
	jQuery.fn.initDrop = function (fileCallback) {
		return this.each(function () {
			$(this).bind("dragover", function () {
				$(this).addClass('dropfocus');
				//$(".drop_container").addClass('dropfocus');
				return false;
			});
			$(this).bind("dragleave", function () {
				$(this).removeClass('dropfocus');
				//$(".drop_container").removeClass('dropfocus');
				return false;
			});
			$(this).bind("drop", function (e) {
				$(this).removeClass("dropfocus");
				//$(".drop").removeClass("dropfocus");
				//$(".drop_container").addClass('dropfocus');
				e.preventDefault();
				var files = e.originalEvent.dataTransfer.files;
				for (var i=0; i<files.length; i++) {
					(function(){
						var filename = files[i].fileName;
						var reader = new FileReader();
						reader.onload = function (evt) {
							fileCallback(evt.target.result, filename);
						};
						reader.readAsText(files[i]);
					})();
				}
			});
			//$(this).prepend('<div class="image_container drop_container"></div>');
		});
	};
});


