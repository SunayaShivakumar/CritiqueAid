var savePrefs = document.getElementById("user_prefs");

chrome.storage.sync.get(['isWeb', 'isPrt', 'isLog', 'valLen', 'valSnt', 'valSpc'], function (userPrefs) {
    document.getElementById("websites_box").checked = userPrefs.isWeb;
    document.getElementById("portfolios_box").checked = userPrefs.isPrt;
    document.getElementById("logos_box").checked = userPrefs.isLog;

    document.getElementById("op_length").value = userPrefs.valLen;
    document.getElementById("op_sentiment").value = userPrefs.valSnt;
    document.getElementById("op_specificity").value = userPrefs.valSpc;
});

savePrefs.onclick = function () {
    var isWeb = document.getElementById("websites_box").checked;
    var isPrt = document.getElementById("portfolios_box").checked;
    var isLog = document.getElementById("logos_box").checked;

    var valLen = document.getElementById("op_length").value;
    var valSnt = document.getElementById("op_sentiment").value;
    var valSpc = document.getElementById("op_specificity").value;

    chrome.storage.sync.set({'isWeb': isWeb, 'isPrt': isPrt, 'isLog': isLog, 'valLen': valLen, 'valSnt': valSnt, 'valSpc': valSpc}, function () {
        close();
    })
};
