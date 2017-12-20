/*
simple runtime validation that checks if the content
of a page including the url belongs to a Reddit page,
and returns a message if so.
*/
chrome.runtime.sendMessage(
    {validate: "showValidPage"}
);