// ==UserScript==
// @name         night bar
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  gives you a brightness control on right top coner
// @author       You
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=57.166
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @copyright 2023, kasusa (https://openuserjs.org/users/kasusa)
// ==/UserScript==


(function() {
    'use strict';
let a = document.body.appendChild(document.createElement("div"));
a.innerHTML =
`
<style>
            #brightness-cover {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0);
                z-index: 999;
                opacity: 0;
                pointer-events:none;
            }
            #brightness-controlbox{
                position: fixed;
                background-color: rgba(0, 0, 0, 0.5);
                border-radius: 0 0  0 10px;
                padding: 5px;
                top: 0px;
                right: 0px;
                z-index: 1000;
                opacity: .0;
                transform: translateY(-90%);
            }
            #brightness-controlbox:hover{
                opacity: 1;
                transform: translateY(0%);
            }
</style>
<div id="brightness-cover">
</div>
<div id="brightness-controlbox" >
    <input type="range" min="0" max="65" value="0" class="slider" id="brightness-Range">
</div>
`
let slider = document.getElementById("brightness-Range");
let output = document.getElementById("demo");
slider.oninput = function() {
    localStorage.setItem("brightness", this.value);
    document.querySelector("#brightness-cover").style = "opacity: " + this.value + "%" ;
}
console.log('🌙added brightness cover');

// get the stored brightness
try {
    let oldBrightness =  localStorage.getItem("brightness");
    slider.value = oldBrightness;
    document.querySelector("#brightness-cover").style = "opacity: " + oldBrightness + "%" ;
    console.log("🌙stored brightness:" + oldBrightness )
} catch (error) {
    console.log("🌙stored brightness not found");
}

})();