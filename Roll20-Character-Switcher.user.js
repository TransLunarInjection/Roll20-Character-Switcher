// ==UserScript==
// @name         Roll20 Character Switcher
// @namespace    de.idrinth
// @homepage     https://github.com/Idrinth/Roll20-Character-Switcher
// @version      1.1.0
// @description  Switches the chatting character to the one who's sheet or macro you clicked on
// @author       Idrinth
// @match        https://app.roll20.net/editor/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var a = function() {
        document.getElementsByTagName('body')[0].addEventListener('mousedown', function(event) {
            var e = window.event || event;
            if (e.target.tagName !== 'BUTTON') {
                return;
            }
            var id='';
            if(e.target.hasAttribute('type') && e.target.getAttribute('type') === 'roll') {
                var character = e.target;
                while (!character.hasAttribute('data-characterid')) {
                    if(!character.parentNode) {
                        return;
                    }
                    character = character.parentNode;
                }
                id = 'character|' + character.getAttribute('data-characterid');
            } else if(e.target.hasAttribute('class') && e.target.getAttribute('class') === 'btn' && e.target.parentNode.hasAttribute('data-macroid')) {
                id = 'character|' + (e.target.parentNode.getAttribute('data-macroid')).split('|')[0];
            }
            if(!id) {
                return;
            }
            var select = document.getElementById('speakingas');
            for (var i = 0; i < select.options.length; i++) {
                if (select.options[i].value === id) {
                    select.selectedIndex = i;
                    return;
                }
            }
        });
    };
    eval('(' + a.toString() + '())');
})();
