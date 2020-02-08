// ==UserScript==
// @name         jstris Sprint Coach
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Changes background colour when you go too slow (based on user-defined PPS thresholds)
// @author       fourwide (xenonsb), Oki
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// ==/UserScript==

/**************************
  Under PPS Restart Script
**************************/
(function() {
    window.addEventListener('load', function(){

localStorage.backgroundOpt = localStorage.backgroundOpt || "0";
localStorage.thresholdRed = localStorage.thresholdRed || "0";
localStorage.thresholdOrange = localStorage.thresholdOrange || "0";

document.body.style['background-image'] = '';

var pbOption = document.createElement("table");
pbOption.innerHTML = `<tbody><tr><td><input name='bgPPS' onclick="localStorage.backgroundOpt=this.checked"id='backgroundPPS'type="checkbox"><label for="backgroundPPS">Change background colour</label></td><td></td></tr><tr><td colspan="2"><span class="settingsDesc">to Red if PPS below <input oninput='localStorage.thresholdRed=this.value' id='tRed' style="width:50px"></span></td></tr><tr><td colspan="2"><span class="settingsDesc">to Orange if PPS below <input oninput='localStorage.thresholdOrange=this.value' id='tOrange' style="width:50px"></span></td></tr></tbody><br>`
tab_other.appendChild(pbOption);

document.getElementById('backgroundPPS').checked = localStorage.backgroundOpt;
tRed.value = localStorage.thresholdRed;
tOrange.value = localStorage.thresholdOrange;

var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}
if(typeof getParams != "function"){var getParams=a=>{var params=a.slice(a.indexOf("(")+1);params=params.substr(0,params.indexOf(")")).split(",");return params}}

function afterRoundStart() {
	document.body.style['background-image'] = '';
	document.body.style['background-color'] = 'green';
}

var placeBlockFunc = Game['prototype']["startReadyGo"].toString()
placeBlockFunc =  trim(placeBlockFunc) + trim(afterRoundStart.toString())
Game['prototype']["startReadyGo"] = new Function(placeBlockFunc);

function afterPlaceBlock() {
	if(document.getElementById('backgroundPPS').checked && this['clock']>2 && 0 != this['getPPS']()) {
		if (this['getPPS']() < +tRed.value) {
			document.body.style['background-color'] = 'red';
		}
		else if (this['getPPS']() < +tOrange.value) {
			document.body.style['background-color'] = 'orange';
		}
		else if (+tOrange.value <= this['getPPS']()) {
			document.body.style['background-color'] = 'green';
		}
	};
};

var placeBlockFunc2 = Game['prototype']["placeBlock"].toString();
var params2 = getParams(placeBlockFunc2);
placeBlockFunc2 =  trim(placeBlockFunc2) + trim(afterPlaceBlock.toString());
Game['prototype']["placeBlock"] = new Function(...params2, placeBlockFunc2);


    });
})();