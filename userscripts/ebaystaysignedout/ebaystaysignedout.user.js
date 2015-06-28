// ==UserScript==
// @id             Ebay Stay Signed Out
// @name           Ebay Stay Signed Out
// @version        1.0
// @namespace      Ebay Stay Signed Out
// @author         Ebay Stay Signed Out
// @description    Ebay Stay Signed Out
// @include        https://signin.ebay.co.uk/*
// @run-at         document-end
// ==/UserScript==

(function() {

	checkBox = document.getElementById('signed_in');
	
	if (checkBox!=null) {
		checkBox.checked = false;
	} 

})();