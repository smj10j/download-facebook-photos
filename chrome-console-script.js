jQuery = $$

function appendStringAsNodes(element, html) {
    var frag = document.createDocumentFragment(),
        tmp = document.createElement('body'), child;
    tmp.innerHTML = html;
    // Append elements in a loop to a DocumentFragment, so that the browser does
    // not re-render the document for each node
    while (child = tmp.firstChild) {
        frag.appendChild(child);
    }
    element.appendChild(frag); // Now, append all elements at once
    frag = tmp = null;
}

// Fetch photo URLs
photoURLs = []
urlEls = jQuery('.fbPhotoStarGridElement')
urlEls.forEach(function(el) {
    url = el.attributes['data-starred-src'].value
    if(url) {
        photoURLs.push(url); 
    }
})


// Helper for downloading files with a specified filename
// https://github.com/smj10j/download-data-uri
var isWebkit = 'WebkitAppearance' in document.documentElement.style
var downloadDataURI = function(options) {
    if(!options) {
        return;
    }
    var callback = options.onComplete || false;
    if(!isWebkit) {
        location.href = options.data;
    }
    options.filename || (options.filename = "download." + options.data.split(",")[0].split(";")[0].substring(5).split("/")[1]);
    options.url || (options.url = "http://download-data-uri.appspot.com/");
    var form = document.createElement("form");
    form.method = 'post';
    form.style = 'display:none';
    form.action = options.url;
    appendStringAsNodes(
        form,
       '<input type="hidden" name="filename" value="'+options.filename+'"/><input type="hidden" name="data" value="'+options.data+'"/>'
    );
    form.submit();
    if(typeof callback === "function") {
        setTimeout(function() {
            callback(options.filename)
        }, 1);
    }
    form.remove();
}


// Downloads a photo and starts the next download on completion
function downloadNextPhoto(photoIndex) {
    console.log("Downloading photo with photoIndex="+photoIndex+" and url="+photoURLs[photoIndex]);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var reader = new window.FileReader();
            reader.readAsDataURL(this.response);
            reader.onloadend = function() {
                var data = reader.result.split('base64,')[1];
                downloadDataURI({ 
                    url: "http://localhost:8080/",
                    filename: "Facebook Photo " + (photoIndex+1) + ".jpeg", 
                    data: "data:image/jpeg;base64," + data,
                    onComplete: function(filename) {
                        console.log("Photo with photoIndex=photoIndex="+photoIndex+" has been saved as " + filename + "!")                        
                        if(photoIndex+1 < photoCount) {
                            console.log("Sleeping a little bit before our next download...");
                            setTimeout(function() {
                                downloadNextPhoto(photoIndex+1);
                            }, 100);
                        }
                    }
                });
            }
        }
    }
    xhr.open('GET', photoURLs[photoIndex]);
    xhr.responseType = 'blob';
    xhr.send();
}


var photoCount = photoURLs.length;

// Go!
downloadNextPhoto(0)
