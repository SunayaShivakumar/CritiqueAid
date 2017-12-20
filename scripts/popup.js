/* project specific url endpoints. */
var baseURL = "https://www.reddit.com";
var designCritiquesURL = baseURL + "/r/design_critiques";

/* project specific buttons and links. */
var goodExample = document.getElementById("good-example");
var badExample = document.getElementById("bad-example");
var searchInput = document.getElementById("ca-search");
var postLink = document.getElementById("ca-link");
var showVisuals = document.getElementById("ca-visuals");
var nextExample = document.getElementById("next-example");
var prevExample = document.getElementById("prev-example");

var chartLength, chartComments;

/*
GET request function that takes in a url and a callback function.
this function creates a new xml http request that performs a GET
request on the the given url and executes the callback function,
if the request status is 200(OK).
 */
function getJSON(url, callback) {
    var xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.open("GET", url, true);
    xmlHttpRequest.responseType = "json";

    xmlHttpRequest.onload = function() {
        var status = xmlHttpRequest.status;
        if (status === 200) {
            callback(null, xmlHttpRequest.response);
        } else {
            callback(status, xmlHttpRequest.response);
        }
    };

    xmlHttpRequest.send();
}

/*
getPost function returns an array of  Reddit post with most comments
given the response data that consists a list of posts.
 */
function getPost(response) {
    var numExamples = 2;
    var allComments = response.data.children;
    var numComments = [0, 0, 0];
    var numChild = [0, 0, 0];

    for (var i = 0; i < allComments.length; i++) {
        var postComments = allComments[i].data.num_comments;

        if (postComments > numComments[0]) {
            numComments[1] = numComments[0];
            numComments[0] = postComments;
            numChild[1] = numChild[0];
            numChild[0] = i;
        }

        if (postComments > numComments[1] && postComments < numComments[0]) {
            numComments[1] = postComments;
            numChild[1] = i;
        }
    }

    var examplePosts = [];
    for (var i = 0; i < numExamples; i++) {
        examplePosts.push(allComments[numChild[i]]);
    }

    return examplePosts;
}

/*
getComment function returns the longest or shortest comment
based on a given boolean value, and the response data that
consists of a list of comments for a Reddit post.
 */
function getComment(response, searchGood) {
    var allComments = response[1].data.children;
    var length = allComments[0].data.body.length;
    var child = 0;

    for (var i = 1; i < allComments.length; i++) {
        var commentBody = allComments[i].data.body;

        if (searchGood === true) {
            if (commentBody.length > length &&
                commentBody.toLowerCase().indexOf("bot") === -1) {
                length = commentBody.length;
                child = i;
            }
        } else {
            if (commentBody.length < length &&
                commentBody !== "[deleted]" &&
                commentBody.toLowerCase().indexOf("bot") === -1) {
                length = commentBody.length;
                child = i;
            }
        }
    }

    return allComments[child];
}

/*
function to execute when the search icon button is clicked.
formats the url to access and calls the getJSON function, and
once the top results are acquired calls the getJSON function again
to do another request to access the example comments on the post.
the search functionality currently returns the newest comment on a post.
 */
searchInput.onclick = function () {
    var searchFor = document.getElementById("ca-search-field");
    var text = document.getElementById("ca-text");
    var link = document.getElementById("ca-link");

    document.getElementById("ca-extra-info").style.display = "block";

    if (searchFor.value.length > 0) {
        var searchURL = designCritiquesURL +
            "/search.json?q=" + searchFor.value.toLowerCase() +
            "&restrict_sr=on&sort=top";

        getJSON(searchURL,
            function (error, responseData) {
                if (error !== null || responseData === null || responseData === undefined) {
                    text.innerHTML = "Sorry, that did not return anything. Try something else.";
                    console.log(error);
                } else {
                    var examplePosts = getPost(responseData);

                    var exampleURLs = [];

                    for (var i = 0; i < examplePosts.length; i++) {
                        var url = baseURL + examplePosts[i].data.permalink;
                        exampleURLs.push(url);
                    }

                    // set the href attribute for the link to original reddit post.
                    link.setAttribute("href", exampleURLs[0]);
                    // create new tab upon clicking above link.
                    postLink.onclick = function () {
                        chrome.tabs.create({url: postLink.href});
                    };

                    if (chartComments != undefined || chartComments != null) {
                        chartComments.destroy();
                    }
                    chartComments = getChartComments(getCommentsData(responseData));

                    // search for the first example post sorting for the newest one.
                    exampleURLs[0] = exampleURLs[0].substring(0, exampleURLs[0].length - 1);
                    exampleURLs[0] += ".json?sort=new";

                    // search for newest example post.
                    getJSON(exampleURLs[0],
                        function (exError, exResponseData) {
                            if (exError !== null) {
                                console.log(exError);
                            } else {
                                // set innerHTML text with comment.
                                var comment = getComment(exResponseData, true);
                                text.innerHTML = comment.data.body;

                                // destroy old chart canvases and set new charts.
                                if (chartLength != undefined || chartLength != null) {
                                    chartLength.destroy();
                                }
                                chartLength = getChartLength(getLengthData(exResponseData));
                            }
                        });

                    /*
                    function to execute when the nextExample button is clicked after the
                    good example button is clicked and a search query is submitted.
                    */
                    nextExample.onclick = function () {
                        // set the href attribute for the link to original reddit post.
                        link.setAttribute("href", exampleURLs[1]);
                        // create new tab upon clicking above link.
                        postLink.onclick = function () {
                            chrome.tabs.create({url: postLink.href});
                        };

                        if (chartComments != undefined || chartComments != null) {
                            chartComments.destroy();
                        }
                        chartComments = getChartComments(getCommentsData(responseData));

                        // search for the first example post sorting for the newest one.
                        exampleURLs[1] = exampleURLs[1].substring(0, exampleURLs[1].length - 1);
                        exampleURLs[1] += ".json?sort=new";

                        // search for newest example post.
                        getJSON(exampleURLs[1],
                            function (exError, exResponseData) {
                                if (exError !== null) {
                                    console.log(exError);
                                } else {
                                    var comment = getComment(exResponseData, true);
                                    text.innerHTML = comment.data.body;

                                    // destroy old chart canvases and set new charts.
                                    if (chartLength != undefined || chartLength != null) {
                                        chartLength.destroy();
                                    }
                                    chartLength = getChartLength(getLengthData(exResponseData));
                                }
                            });
                    };

                    /*
                    function to execute when the prevExample button is clicked after the
                    good example button is clicked and a search query is submitted.
                    */
                    prevExample.onclick = function () {
                        // set the href attribute for the link to original reddit post.
                        link.setAttribute("href", exampleURLs[0]);
                        // create new tab upon clicking above link.
                        postLink.onclick = function () {
                            chrome.tabs.create({url: postLink.href});
                        };

                        if (chartComments != undefined || chartComments != null) {
                            chartComments.destroy();
                        }
                        chartComments = getChartComments(getCommentsData(responseData));

                        // search for the first example post sorting for the newest one.
                        exampleURLs[0] = exampleURLs[0].substring(0, exampleURLs[0].length - 1);
                        exampleURLs[0] += ".json?sort=new";

                        // search for newest example post.
                        getJSON(exampleURLs[0],
                            function (exError, exResponseData) {
                                if (exError !== null) {
                                    console.log(exError);
                                } else {
                                    var comment = getComment(exResponseData, true);
                                    text.innerHTML = comment.data.body;

                                    // destroy old chart canvases and set new charts.
                                    if (chartLength != undefined || chartLength != null) {
                                        chartLength.destroy();
                                    }
                                    chartLength = getChartLength(getLengthData(exResponseData));
                                }
                            });
                    };
                }
            });
    }
};

/*
function to execute when the goodExample button is clicked.
changes the placeholder text.
*/
goodExample.onclick = function () {
    var text = document.getElementById("ca-text");
    text.innerHTML = "When you search for keywords like \"resume\" " +
        "or \"portfolio\" in the field above, " +
        "you will get examples of what a good critique would look like here.";

    document.getElementById("ca-extra-info").style.display = "none";
};

/*
function to execute when the badExample button is clicked.
changes the placeholder text.
if user searches for a keyword on this view, this function also
calls the getJSON function to display an example of a bad comment.
*/
badExample.onclick = function () {
    var text = document.getElementById("ca-text");
    text.innerHTML = "Search for keywords like \"resume\" " +
        "or \"portfolio\" in the field above, " +
        "you will get examples of what a bad critique here.";

    document.getElementById("ca-extra-info").style.display = "none";

    /*
    function to call when the search icon button is clicked after
    clicking on the badExample button.
     */
    searchInput.onclick = function () {
        var searchFor = document.getElementById("ca-search-field");
        var link = document.getElementById("ca-link");

        document.getElementById("ca-extra-info").style.display = "block";

        if (searchFor.value.length > 0) {

            // search for design_critiques sub-reddit specific posts
            // and filter for the top posts.
            var searchURL = designCritiquesURL +
                "/search.json?q=" + searchFor.value.toLowerCase() +
                "&restrict_sr=on&sort=controversial";

            getJSON(searchURL,
                function (error, responseData) {
                    if (error !== null || responseData === null || responseData === undefined) {
                        text.innerHTML = "Sorry, that did not return anything. Try something else.";
                        console.log(error);
                    } else {
                        var examplePosts = getPost(responseData);

                        var exampleURLs = [];

                        for (var i = 0; i < examplePosts.length; i++) {
                            var url = baseURL + examplePosts[i].data.permalink;
                            exampleURLs.push(url);
                        }

                        // set the href attribute for the link to original reddit post.
                        link.setAttribute("href", exampleURLs[0]);
                        // create new tab upon clicking above link.
                        postLink.onclick = function () {
                            chrome.tabs.create({url: postLink.href});
                        };

                        if (chartComments != undefined || chartComments != null) {
                            chartComments.destroy();
                        }
                        chartComments = getChartComments(getCommentsData(responseData));

                        // search for the first example post sorting for the oldest one.
                        exampleURLs[0] = exampleURLs[0].substring(0, exampleURLs[0].length - 1);
                        exampleURLs[0] += ".json?sort=old";

                        // search for oldest example post.
                        getJSON(exampleURLs[0],
                            function (exError, exResponseData) {
                                if (exError !== null) {
                                    console.log(exError);
                                } else {
                                    var comment = getComment(exResponseData, false);
                                    text.innerHTML = comment.data.body;

                                    // destroy old chart canvases and set new charts.
                                    if (chartLength != undefined || chartLength != null) {
                                        chartLength.destroy();
                                    }
                                    chartLength = getChartLength(getLengthData(exResponseData));
                                }
                            });

                        /*
                        function to execute when the nextExample button is clicked after the
                        bad example button is clicked and a search query is submitted.
                         */
                        nextExample.onclick = function () {
                            // set the href attribute for the link to original reddit post.
                            link.setAttribute("href", exampleURLs[1]);
                            // create new tab upon clicking above link.
                            postLink.onclick = function () {
                                chrome.tabs.create({url: postLink.href});
                            };

                            if (chartComments != undefined || chartComments != null) {
                                chartComments.destroy();
                            }
                            chartComments = getChartComments(getCommentsData(responseData));

                            // search for the first example post sorting for the newest one.
                            exampleURLs[1] = exampleURLs[1].substring(0, exampleURLs[1].length - 1);
                            exampleURLs[1] += ".json?sort=old";

                            // search for newest example post.
                            getJSON(exampleURLs[1],
                                function (exError, exResponseData) {
                                    if (exError !== null) {
                                        console.log(exError);
                                    } else {
                                        var comment = getComment(exResponseData, false);
                                        text.innerHTML = comment.data.body;

                                        // destroy old chart canvases and set new charts.
                                        if (chartLength != undefined || chartLength != null) {
                                            chartLength.destroy();
                                        }
                                        chartLength = getChartLength(getLengthData(exResponseData));
                                    }
                                });
                        };

                        /*
                        function to execute when the prevExample button is clicked after the
                        bad example button is clicked and a search query is submitted.
                         */
                        prevExample.onclick = function () {
                            // set the href attribute for the link to original reddit post.
                            link.setAttribute("href", exampleURLs[0]);
                            // create new tab upon clicking above link.
                            postLink.onclick = function () {
                                chrome.tabs.create({url: postLink.href});
                            };

                            if (chartComments != undefined || chartComments != null) {
                                chartComments.destroy();
                            }
                            chartComments = getChartComments(getCommentsData(responseData));

                            // search for the first example post sorting for the newest one.
                            exampleURLs[0] = exampleURLs[0].substring(0, exampleURLs[0].length - 1);
                            exampleURLs[0] += ".json?sort=old";

                            // search for newest example post.
                            getJSON(exampleURLs[0],
                                function (exError, exResponseData) {
                                    if (exError !== null) {
                                        console.log(exError);
                                    } else {
                                        var comment = getComment(exResponseData, false);
                                        text.innerHTML = comment.data.body;

                                        // destroy old chart canvases and set new charts.
                                        if (chartLength != undefined || chartLength != null) {
                                            chartLength.destroy();
                                        }
                                        chartLength = getChartLength(getLengthData(exResponseData));
                                    }
                                });
                        };
                    }
                });
        }
    };
};

/*
function to execute when the Show Visualizations button is clicked.
It acts as a toggle button setting to display and hide the visualizations when needed.
 */
showVisuals.onclick = function () {
    var charts = document.getElementById("charts-content");
    var chartsText = document.getElementById("ca-visuals-text");

    if (charts.style.display === "block") {
        charts.style.display = "none";
        chartsText.innerHTML = "Show Visualizations"
    } else {
        charts.style.display = "block";
        chartsText.innerHTML = "Hide Visualizations"
    }
};
