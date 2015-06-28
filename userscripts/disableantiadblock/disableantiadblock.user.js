// ==UserScript==
// @name           Disable Anti Adblock
// @namespace      Disable Anti Adblock
// @author         Disable Anti Adblock
// @description    Disable Anti Adblock
// @include       http://www.onlinemoviesfreee.com/*
// @run-at        document-end
// @grant         none
// ==/UserScript==

(function(){

//function removeBlock()
//{
//    var directNodes = document.body.childNodes;
//    for (var i = 0; i < directNodes.length; i++)
//    {
//        elem = directNodes[i];
//        var ps = elem.childNodes;
//        for (var j = 0; j < ps.length; j++)
//        {
//            p = ps[j];
//            try {
//                if (p.tagName.toLowerCase() != 'p') { continue; }
//                if (p.innerHTML.indexOf('Please disable your ad blocker') == 0) {
                    //console.log(p.tagName + ' ' + p.innerHTML);
                    //elem.style.display = 'none';
//                    elem.getParentNode().removeChild(elem);
//                    return;
//                }
//            } catch (err) {}
//        }
//    }
//}

//window.addEventListener("load", removeBlock, false);


// It seems some sites circumvented the above method by simply including 
//  the antblock.org script multiple times! Sneaky :)
// The code below should fix it.
// Inspired by http://userscripts.org/scripts/review/138420

window.addEventListener('DOMNodeInserted', function(event) {
    var ele = event.target;
    if (ele.parentNode == document.body &&
        ele.id && 
        ele.id.length == 4 && 
        ele.innerHTML.indexOf("Please disable your ad blocker") < 5)
    {
        ele.parentNode.removeChild(ele);
    }
});

})();
