// This is an active module of the ajdeveloped Add-on

var data = require("sdk/self").data
var prefs = require("sdk/simple-prefs").prefs
var cm = require("sdk/context-menu");
var widget = require("sdk/widget");
var tabs = require("tabs");
var windows = require("sdk/windows").browserWindows;

var {Cc, Ci} = require('chrome');
var mediator = Cc['@mozilla.org/appshell/window-mediator;1'].getService(Ci.nsIWindowMediator);
 

exports.main = function(){
    var enumerator = mediator.getEnumerator('navigator:browser');
    while(enumerator.hasMoreElements()) {
        var win = enumerator.getNext();
        addToolbarButton(win.document);
    }
    addContextMenuItem();
}

exports.onUnload = function(reason) {
    var enumerator = mediator.getEnumerator('navigator:browser');
    while(enumerator.hasMoreElements()) {
        var win = enumerator.getNext();
        removeToolbarButton(win.document);
    }
}

windows.on('open', function() {
    var win = mediator.getMostRecentWindow('navigator:browser');
    addToolbarButton(win.document);
});


function addContextMenuItem() {
    //Adding context menu item
    cm.Item({
      label: "PlayIt on XBMC",
      context: cm.SelectorContext("a[href]"),
      contentScript: 'self.on("click", function (node, data) {' +
                     '  self.postMessage([node.href,node.textContent.trim()]);' +
                     '});',
      onMessage: function (hyperlink) {
          myAlert("Video selected", hyperlink[1]);
          playIt(prefs.serviceAddress,prefs.servicePort,hyperlink[0]);
      }
    });
}

// add our button
function addToolbarButton(document) {
    // this document is an XUL document	
	var navBar = document.getElementById('nav-bar');
	if (!navBar) {
		return;
	}
	var btn = document.createElement('toolbarbutton');
	btn.setAttribute('id', 'playit-btn');
	btn.setAttribute('type', 'menu-button');
	// the toolbarbutton-1 class makes it look like a traditional button
	btn.setAttribute('class', 'toolbarbutton-1');
	// the data.url is relative to the data folder
	btn.setAttribute('image', data.url('Icon-toolbar.png'));
	btn.setAttribute('orient', 'horizontal');
	// this text will be shown when the toolbar is set to text or text and iconss
	btn.setAttribute('label', 'PlayIt');
    btn.setAttribute('tooltiptext', 'PlayIt on XBMC')
	btn.addEventListener('command', playActiveUrl, false);
    
    var menupopup = document.createElement('menupopup');
    var menuitem1 = document.createElement('menuitem');
    menuitem1.setAttribute('id', 'playit-item');
    menuitem1.setAttribute('class', 'menuitem-iconic')
    menuitem1.setAttribute('label', 'Play current URL');
    menuitem1.addEventListener('command', playActiveUrl, false);
    
    var menuitem2 = document.createElement('menuitem');
    menuitem2.setAttribute('id', 'frameview-item');
    menuitem2.setAttribute('class', 'menuitem-iconic')
    menuitem2.setAttribute('label', 'Enable frame view');
    menuitem2.addEventListener('command', viewFrame, false);
    
    menupopup.appendChild(menuitem1);
    menupopup.appendChild(menuitem2);
    btn.appendChild(menupopup);
	navBar.appendChild(btn);
}

function playActiveUrl(event) {
    active_url = require("sdk/tabs").activeTab.url;
    playIt(prefs.serviceAddress,prefs.servicePort,active_url);
    event.stopPropagation();
}

function viewFrame(event) {
    worker = tabs.activeTab.attach({
        contentScriptWhen: "start",
        contentScriptFile: [data.url("jquery-2.0.0.min.js"),data.url("view-inject.js")]
    });
    myAlert("PlayIt Frame View", "Please click on PlayIt bar appears on top of video frame.");
    worker.port.emit("viewFrame");
    worker.port.on("playItFrameAction", function (playItReq) {
        myAlert("Video selected", playItReq.url);
        playIt(prefs.serviceAddress,prefs.servicePort,playItReq.url);
    });
    event.stopPropagation();
}
 
function removeToolbarButton(document) {
	// this document is an XUL document
	var navBar = document.getElementById('nav-bar');
	var btn = document.getElementById('playit-btn');
	if (navBar && btn) {
		navBar.removeChild(btn);
	}
}


function playIt(serviceAddress, servicePort, active_url) {
    //service_url = "http://apple-tv.local:8181/PlayIt"
    service_url = "http://"+serviceAddress+":"+servicePort+"/PlayIt"
    console.log(service_url)
    rpc = require("rpc")
    var playItService = new rpc.ServiceProxy(service_url, {
    			asynchronous : true,
				protocol : "JSON-RPC",
                sanitize : false,
				methods : [ 'ping', 'playHostedVideo', 'playVideo' ]
			}, false);
    
	
	myAlert('Processing request',
			'Sending PlayIt request to XBMC, please wait...')

	try {
		playItService
				.playHostedVideo({
					params : {
						'videoLink' : active_url
					},
					onSuccess : function(responseObj) {
						title = responseObj.status
						if (responseObj.status === 'success')
							title = 'Playback started'
						else if (responseObj.status === 'error')
							title = 'Playback failed'
						else if (responseObj.status === 'exception')
							title = 'Unexpected error'
						myAlert(title, responseObj.message)
					},
					onException : function(err) {
						console.log(err)
                        if (err != undefined && err.code != undefined
								&& err.code === 101)
							myAlert('Network error',
									'Unable to connect or request time-out. Check PlayIt add-on preferences.')
						else
							myAlert('Unknown error',
									'Firefox extension is unable to process request due to error.')
						return true
					},
					onComplete : function(responseObj) {
						//nothing
					}
				})

	} catch (err) {
		console.log(err)
        if (err != undefined && err.code != undefined
				&& err.code === 101)
			myAlert('Network error',
					'Unable to connect or request time-out. Check PlayIt add-on preferences.')
		else
			myAlert('Unknown error',
					'Firefox extension is unable to process request due to error.')
	}

}
function myAlert(title, msg) {
	title = 'PlayIt: ' + title
    var myIconURL = data.url("icon.png");
	require("sdk/notifications").notify({
        title: title,
        text: msg,
        iconURL: myIconURL
    });
}