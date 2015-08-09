var handlePlayItAction = function(event) {
	var playItReq = {
		"url" : event.data
	};
	self.port.emit("playItFrameAction",playItReq);
}

var seekForFrameAndEmbed = function() {
	$("iframe,embed")
			.each(
					function() {
						var src = $(this).attr("src");
						var height = $(this).height();
						var width = $(this).width();

						if (src !== undefined && src.match("^http")
								&& !src.match(".swf$") && height > 300
								&& width > 300) {

							var div = $("<div style=\"position:absolute; background-color:black; opacity:0.4; font-variant: small-caps; font-family:tahoma; font-weight:bold; font-size:16px; color:white; text-align: left;\"></div>");
							div.hover(function() {
								div.css('opacity', '0.7');
								div.css('cursor', 'hand');
								div.css('cursor', 'pointer');
							}, function() {
								div.css('opacity', '0.4');
							});

							var img = $("<img style=\"-webkit-border-radius:0px; border-radius:0px; padding:0px; background-color:white; position: absolute;\"/>");
							img.attr("src", "http://s23.postimg.org/y9ocav5jr/Icon_64.png");

							

							img.css('margin-top', '5px');
							img.css('margin-left', '5px');

							div.click(src, handlePlayItAction)

							div.width(width);
							div.height(74);
							
    						var position = {}
							position.left = this.offsetLeft;
							position.top = this.offsetTop;
							div.css(position);
                            
							$(this).before(div);
							div.append(img);
							div
									.append('<p style=" text-align: center; margin-left: 80px;margin-top: 30px;margin-left: 10px;">PlayIt on XBMC</p>');
						}
					});

}
self.port.on("viewFrame", seekForFrameAndEmbed);
