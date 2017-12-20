/* project specific buttons. */
var saveOptions = document.getElementById("ca-save");
var resetOptions = document.getElementById("ca-reset");

/* project specific sliders. */
var visualsSlider = document.getElementById("ca-visuals-slider");
var examplesSlider = document.getElementById("ca-examples-slider");

/* default options. */
const visualsDefault = "1";
const examplesDefault = "3";

resetOptions.onclick = function () {
    visualsSlider.value = visualsDefault;
    examplesSlider.value = examplesDefault;

    chrome.storage.sync.set({
        "visuals-value": visualsSlider.value,
        "examples-value": examplesSlider.value
    }, function () {
        // window.alert("Options reset to default.")
    });
};
