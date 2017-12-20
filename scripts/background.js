/*
function to check if the request's validation returns
the right message, so that we can enable the extension.
*/
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
    if (request.validate === "showValidPage") {
        chrome.tabs.query(
            {active: true, currentWindow: true},
            function (tabs) {
                chrome.pageAction.show(tabs[0].id);
        });
    }
});

