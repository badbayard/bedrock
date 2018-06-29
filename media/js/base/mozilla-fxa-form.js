/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// create namespace
if (typeof Mozilla === 'undefined') {
    var Mozilla = {};
}

Mozilla.FxaForm = (function(Mozilla) {
    'use strict';

    var fxaForm = document.getElementById('fxa-email-form');
    var fxaSubmitButton = document.getElementById('fxa-email-form-submit');

    // swap form action for Fx China re-pack
    function init() {
        // disable form while we check distribution
        fxaSubmitButton.disabled = true;

        var mozillaonlineAction = fxaForm.dataset.mozillaonlineAction;

        if (mozillaonlineAction) {
            Mozilla.Client.getFirefoxDetails(function(data) {
                if (data.distribution !== 'default') {
                    fxaForm.action = mozillaonlineAction;
                }

                fetchTokens();
            });
        } else {
            fetchTokens();
        }
    }

    // get tokens from FxA for analytics purposes
    function fetchTokens() {
        fxaSubmitButton.disabled = false;

        fetch(fxaForm.getAttribute('action') + 'metrics-flow').then(function(resp) {
            return resp.json();
        }).then(function(r) {
            fxaForm.querySelector('[name="flow_id"]').value = r.flowId;
            fxaForm.querySelector('[name="flow_begin_time"]').value = r.flowBeginTime;
        }).catch(function() {
            // silently fail, leaving flow_id and flow_begin_time as default empty value
        });
    }

    if (fxaForm) {
        init();
    }
})(window.Mozilla);
