// Helper for downloading files with a specified filename
// https://github.com/smj10j/download-data-uri
var isWebkit = 'WebkitAppearance' in document.documentElement.style
var downloadDataURI = function(options) {
    if(!options) {
        return;
    }
    var callback = options.onComplete || false;
    $.isPlainObject(options) || (options = {data: options});
    if(!isWebkit) {
        location.href = options.data;
    }
    options.filename || (options.filename = "download." + options.data.split(",")[0].split(";")[0].substring(5).split("/")[1]);
    options.url || (options.url = "http://download-data-uri.appspot.com/");
    var form = $('<form method="post" action="'+options.url+'" style="display:none"><input type="hidden" name="filename" value="'+options.filename+'"/><input type="hidden" name="data" value="'+options.data+'"/></form>')
    form.submit();
    if(typeof callback === "function") {
        setTimeout(function() {
            callback(options.filename)
        }, 1);
    }
    form.remove();
}

