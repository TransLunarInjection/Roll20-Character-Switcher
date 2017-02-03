// ==UserScript==
// @name         Roll20 Character Switcher
// @namespace    de.idrinth
// @homepage     https://github.com/Idrinth/Roll20-Character-Switcher
// @version      1.0.1
// @description  Switches the chatting character to the one who's sheet you clicked on
// @author       Idrinth
// @match        https://app.roll20.net/editor/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var a = function() {
        document.getElementsByTagName('body')[0].addEventListener('mousedown', function(event) {
            var e = window.event || event;
            if (e.target.tagName === 'BUTTON' && e.target.hasAttribute('type') && e.target.getAttribute('type') === 'roll') {
                var character = e.target;
                while (!character.hasAttribute('data-characterid')) {
                    character = character.parentNode;
                }
                var id = 'character|' + character.getAttribute('data-characterid');
                var select = document.getElementById('speakingas');
                for (var i = 0; i < select.options.length; i++) {
                    if (select.options[i].value === id) {
                        select.selectedIndex = i;
                        return;
                    }
                }
            }
        });
    };
    eval('(' + a.toString() + '())');
})();
