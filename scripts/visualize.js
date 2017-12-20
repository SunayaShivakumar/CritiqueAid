/* project specific chart canvases. */
var canvasComments = document.getElementById("chart-comments");
var canvasLength = document.getElementById("chart-length");

/*
function to sort the comments data into six different buckets
for chart data. the data is sorted based on number of comments.
 */
function getCommentsData(response) {
    data = [0, 0, 0, 0, 0, 0];
    var allComments = response.data.children;

    for (var i = 0; i < allComments.length; i++) {
        var comments = allComments[i].data.num_comments;
        switch (true) {
            case (comments >= 0 && comments <= 10):
                data[0] += 1;
                break;
            case (comments >= 11 && comments <= 20):
                data[1] += 1;
                break;
            case (comments >= 21 && comments <= 30):
                data[2] += 1;
                break;
            case (comments >= 31 && comments <= 40):
                data[3] += 1;
                break;
            case (comments >= 41 && comments <= 50):
                data[4] += 1;
                break;
            case (comments >= 51):
                data[5] += 1;
                break;
        }
    }
    return data;
}

/*
function to plot a new chart based on the data regarding
number of comments given a list of Reddit posts.
 */
function getChartComments(data) {
    return new Chart(canvasComments, {
        type: 'line',
        data: {
            labels: ["0-10", "11-20", "21-30", "31-40", "41-50", ">51"],
            datasets: [{
                label: '# of Posts',
                data: data,
                backgroundColor: 'rgba(255, 191, 0, 0.2)',
                borderColor: 'rgba(26, 112, 171, 1)',
                borderWidth: 1.5
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Number of Comments'
                    }
                }]
            }
        }
    });
}

/*
function to sort the comments data into six different buckets
for chart data. the data is sorted based on length of comments.
 */
function getLengthData(response) {
    data = [0, 0, 0, 0, 0, 0];
    var allComments = response[1].data.children;

    for (var i = 0; i < allComments.length; i++) {
        var length = allComments[i].data.body.length;
        switch (true) {
            case (length >= 0 && length <= 20):
                data[0] += 1;
                break;
            case (length >= 21 && length <= 40):
                data[1] += 1;
                break;
            case (length >= 41 && length <= 60):
                data[2] += 1;
                break;
            case (length >= 61 && length <= 80):
                data[3] += 1;
                break;
            case (length >= 81 && length <= 100):
                data[4] += 1;
                break;
            case (length >= 101):
                data[5] += 1;
                break;
        }
    }
    return data;
}

/*
function to plot a new chart based on the data regarding
length of comments given an example post with comments.
 */
function getChartLength(data) {
    return new Chart(canvasLength, {
        type: 'line',
        data: {
            labels: ["0-20", "21-40", "41-60", "61-80", "81-100", ">101"],
            datasets: [{
                label: '# of Comments',
                data: data,
                backgroundColor: 'rgba(255, 191, 0, 0.2)',
                borderColor: 'rgba(26, 112, 171, 1)',
                borderWidth: 1.5
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Length of Comments'
                    }
                }]
            }
        }
    });
}