const ds1_urlPrefix = "aHR0cHM6Ly9zZWVraW5nYWxwaGEuY29tL3N5bWJvbC8=";
const ds2_urlPrefix = "aHR0cHM6Ly93d3cuemFja3MuY29tL3N0b2NrL3Jlc2VhcmNoLw==";

var open_new_tab = false;
var default_ds = 1;
chrome.storage.local.get(['open_new_tab', 'default_ds'], function(options) {
    if (isDefined(options.open_new_tab)) {open_new_tab = options.open_new_tab;}
    if (isDefined(options.default_ds)) {default_ds = options.default_ds;}
});

$( document ).ready(function() {
    $("#symbol").focus();
    $("#symbol").on('keyup', function (e) {
      if (e.key === 'Enter' || e.keyCode === 13) {
        handleSubmit();
      }
    });
});

function handleSubmit() {
    let stockRegex = /^[a-zA-Z\s]*$/;
    let symbol = $("#symbol").val().trim();
    if (symbol==null || symbol=="") {
        alert("Symbol must not be blank");
        return;
    }
    else if (!stockRegex.test(symbol)) {
        alert("Symbol must only contain characters");
        return;
    }

    let targetUrl = '';
    if (default_ds == 1) {
        targetUrl = decodeURIComponent(escape(window.atob(ds1_urlPrefix))) + symbol.toUpperCase() + "/earnings";
    } else if (default_ds == 2) {
        targetUrl = decodeURIComponent(escape(window.atob(ds2_urlPrefix))) + symbol.toUpperCase() + "/earnings-calendar";
    }

    if (open_new_tab) {
        chrome.tabs.create({"url": targetUrl});
    }
    else {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            let tab = tabs[0];
            chrome.tabs.update(tab.id, {url: targetUrl});
        });
        $("#symbol").select();
    }
}

function isDefined(smth) {
    return typeof smth !== 'undefined';
}
