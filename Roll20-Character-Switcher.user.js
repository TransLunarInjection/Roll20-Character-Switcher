// ==UserScript==
// @name         Roll20 Character Switcher
// @namespace    de.idrinth
// @homepage     https://github.com/Idrinth/Roll20-Character-Switcher
// @version      1.2.0
// @description  Switches the chatting character to the one whose sheet or macro you clicked on
// @author       Idrinth, KingMarth
// @match        https://app.roll20.net/editor/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var charswitcher = function(event, frame) {
        var e = window.event || event;
        if (e.target.tagName !== 'BUTTON') {
            console.info("Not a character action %o", e);
            return;
        }
        var id='';

        function findAttrInParentsOrFrameParents(target, attr) {
            var usedFrame = false;
            while (!target.hasAttribute(attr)) {
                target = target.parentNode;
                if (!target || !target.hasAttribute) {
                    if (!frame || usedFrame) {
                        console.error("Couldn't find charid in %o", e.target);
                        return;
                    }
                    target = frame;
                    usedFrame = true;
                }
            }
            return target.getAttribute(attr);
        }

        console.info("Click on %o", e.target);
        if(e.target.hasAttribute('type') && e.target.getAttribute('type') === 'roll') {
            console.info("Looks like a roll for %o", e.target);
            id = 'character|' + findAttrInParentsOrFrameParents(e.target, 'data-characterid');
        } else if(e.target.hasAttribute('class') && e.target.getAttribute('class') === 'btn') {
            id = 'character|' + findAttrInParentsOrFrameParents(e.target, 'data-macroid');
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
    };

    function addCharSwitcher(doc, frame) {
        function callback(evt) {
            charswitcher(evt, frame);
        }
        doc.body.addEventListener('mousedown', callback);
        var tokenActions = doc.getElementsByClassName('tokenactions')[0];
        if (tokenActions) {
            tokenActions.addEventListener('mousedown', callback);
        }

        var observer = new MutationObserver(function(mutations) {
            for(const mutation of mutations) {
                console.error
                if (!mutation.addedNodes) continue;
                for (const added of mutation.addedNodes) {
                    if (added.tagName === 'IFRAME') {
                        console.error("new iframe %o", added);
                        added.addEventListener("load", function() {
                            addCharSwitcher(added.contentWindow.document, added);
                        });
                    }
                }

            }
        });

        observer.observe(doc, {attributes: false, childList: true, characterData: false, subtree:true});
    }
    addCharSwitcher(document);
})();
