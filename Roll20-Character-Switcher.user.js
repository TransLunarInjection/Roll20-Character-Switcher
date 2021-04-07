// ==UserScript==
// @name         Roll20 Character Switcher
// @namespace    de.idrinth
// @homepage     https://github.com/Idrinth/Roll20-Character-Switcher
// @version      1.3.0
// @description  Switches the chatting character to the one whose sheet or macro you clicked on
// @author       Idrinth, KingMarth, TransLunarInjection
// @match        https://app.roll20.net/editor/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var charswitcher = function(event, frame) {
        var e = window.event || event;
        if (e.target.tagName !== 'BUTTON') {
            return;
        }
        var id='';

        function findAttrInParentsOrFrameParents(originalTarget, attr) {
            var target = originalTarget;
            var usedFrame = false;
            while (!target.hasAttribute(attr)) {
                target = target.parentNode;
                if (!target || !target.hasAttribute) {
                    if (!frame || usedFrame) {
                        console.error("Couldn't find attr %o in %o or %o", attr, originalTarget, frame);
                        return;
                    }
                    target = frame;
                    usedFrame = true;
                }
            }
            return target.getAttribute(attr);
        }

        if(e.target.hasAttribute('type') && e.target.getAttribute('type') === 'roll') {
            console.debug("Looks like a roll for %o", e.target);
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
                if (!mutation.addedNodes) continue;
                for (const added of mutation.addedNodes) {
                    if (added.tagName === 'IFRAME') {
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
