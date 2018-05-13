window.onload = function () {

    function loadContextMenuItems() {
        // loading msg as get() is asynchronous
        $('#context-menu-items').append('<div class="loading">Loading...</div>');
        // loading context menu items from chrome storage
        chrome.storage.sync.get(null, function (jsonObj) {
            // logs for debugging
            //console.log("In chrome-storage: "+JSON.stringify(jsonObj));
            // remove loading msg
            $('.loading').remove();
            if (typeof jsonObj !== 'undefined' && !$.isEmptyObject(jsonObj)) {
                // jsonObj exists but check whether there are cm items or not
                if (typeof jsonObj.cm_items !== 'undefined' && jsonObj.cm_items.length > 0) {
                    $.each(jsonObj.cm_items, function (i) {
                        $('#context-menu-items').append('<div><input type="text" value="' + jsonObj.cm_items[i].title + '" class="title"/>&nbsp;&nbsp;<input type="text" value="' + jsonObj.cm_items[i].info + '" class="info"/>&nbsp;&nbsp;<button class="delete_item"><img src="delete.png"/></button>&nbsp;<button class="add_item"><img src="add.png"/></button></div>');
                    });
                } else {
                    $('#context-menu-items').append('<div><input type="text" placeholder="Title..." class="title"/>&nbsp;&nbsp;<input type="text" placeholder="Your Information..." class="info"/>&nbsp;&nbsp;<button class="delete_item"><img src="delete.png"/></button>&nbsp;<button class="add_item"><img src="add.png"/></button></div>');
                }
            } else {
                $('#context-menu-items').append('<div><input type="text" placeholder="Title..." class="title"/>&nbsp;&nbsp;<input type="text" placeholder="Your Information..." class="info"/>&nbsp;&nbsp;<button class="delete_item"><img src="delete.png"/></button>&nbsp;<button class="add_item"><img src="add.png"/></button></div>');
            }
        });
    }

    loadContextMenuItems();

    // on clicking save button
    document.getElementById('save').addEventListener('click', function () {
        // create a JSON
        var jsonObj = {
            cm_items: []
        };
        // take values from fields and insert into the JSON created above
        $('#context-menu-items>div').each(function () {
            // if both are blank then do not create an object for them
            if ($(this).find('input:first').val() === "" || $(this).find('input:last').val() === "")
                return;
            var cm_items_obj = {};
            cm_items_obj.title = $(this).find('input:first').val();
            cm_items_obj.info = $(this).find('input:last').val();
            jsonObj.cm_items.push(cm_items_obj);
        });
        // store the JSON in chrome storage
        chrome.storage.sync.set(jsonObj, function () {
            if (chrome.runtime.lastError) {
                $('<div class="alert alert-error">Couldn\'t save, please try again.</div>').appendTo('.alert-container').delay('3000').fadeOut('slow');
            } else {
                // logs for debugging
                //console.log("Fetched from options page: "+JSON.stringify(jsonObj));
                // re-create context menu
                chrome.extension.getBackgroundPage().createContextMenu();
                $('<div class="alert">Saved. Now start filling forms from the context menu in clicks.</div>').appendTo('.alert-container').delay('4000').fadeOut('slow');
            }
        });
    });

    // update doAppend settings
    document.getElementById('do-append').addEventListener('change', function () {
        var isChecked = document.getElementById('do-append').checked;
        if (isChecked) {
            chrome.storage.sync.set({doAppend: 1});
        } else {
            chrome.storage.sync.set({doAppend: 0});
        }
        chrome.extension.getBackgroundPage().createContextMenu();
        $('<div class="alert">Changes saved.</div>').appendTo('.alert-container').delay('3000').fadeOut('slow');
    });

    // check for doAppend settings
    chrome.storage.sync.get('doAppend', function (value) {
        if (value.doAppend == 1) {
            document.getElementById('do-append').checked = true;
        } else {
            document.getElementById('do-append').checked = false;
        }
    });

    // for importing simplefill data
    document.getElementById('import').addEventListener('click', function () {
        var doImport = confirm("Importing will replace your existing data, continue?");
        if (!doImport) {
            return;
        }
        $('#import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', function (evt) {
        var file = evt.target.files[0];
        if (!file) {
            return;
        }
        var fileAsText = "";
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onerror = errorHandler;
        reader.onload = function () {
            fileAsText = reader.result;
            var jsonObj = JSON.parse(fileAsText);
            if (typeof jsonObj == 'undefined' || $.isEmptyObject(jsonObj) || typeof jsonObj.cm_items == 'undefined' || jsonObj.cm_items.length == 0) {
                alert("Please import a valid SimpleFill import file.");
                return;
            }
            chrome.storage.sync.set(jsonObj, function () {
                if (chrome.runtime.lastError) {
                    $('<div class="alert alert-error">Couldn\'t import, please try again.</div>').appendTo('.alert-container').delay('3000').fadeOut('slow');
                } else {
                    // re-create context menu
                    chrome.extension.getBackgroundPage().createContextMenu();
                    $('#context-menu-items').html('');
                    loadContextMenuItems();
                    $('<div class="alert">Imported successfully. Now start filling forms from the context menu in clicks.</div>').appendTo('.alert-container').delay('7000').fadeOut('slow');
                }
            });
        };
    });

    // for exporting simplefill data
    document.getElementById('export').addEventListener('click', function () {
        try {
            var isFileSaverSupported = !!new Blob();
            if (!isFileSaverSupported) {
                alert("Please upgrade your browser!");
                return;
            }
            chrome.storage.sync.get(null, function (jsonObj) {
                if (chrome.runtime.lastError) {
                    alert("Error fetching data!");
                    return;
                }
                var blob = new Blob([JSON.stringify(jsonObj)], {type: "text/plain;charset=utf-8"});
                saveAs(blob, "simplefill.json");
            });
        } catch (e) {
            alert("Problem occurred while exporting: " + e);
        }
    });
};

// error handler for FileReader API
function errorHandler(evt) {
    switch (evt.target.error.code) {
        case evt.target.error.NOT_FOUND_ERR:
            alert('File Not Found!');
            break;
        case evt.target.error.NOT_READABLE_ERR:
            alert('File is not readable');
            break;
        case evt.target.error.ABORT_ERR:
            break; // noop
        default:
            alert('An error occurred reading this file.');
    }
}

// adds one new row for context menu
function add_item(elem) {
    $(elem).parent().after('<div><input type="text" placeholder="Title..." class="title"/>&nbsp;&nbsp;<input type="text" placeholder="Your Information..." class="info"/>&nbsp;&nbsp;<button class="delete_item"><img src="delete.png"/></button>&nbsp;<button class="add_item"><img src="add.png"/></button></div>');
}

// deletes one context menu
function delete_item(elem) {
    if ($('#context-menu-items>div').length <= 1) {
        $('<div class="alert alert-error">Can\'t delete one and only row.</div>').appendTo('.alert-container').delay('3000').fadeOut('slow');
        return;
    }
    $(elem).parent().remove();
}

(function ($) {
    $('.main-container').on('click', '.add_item', function () {
        add_item(this);
    });
    $('.main-container').on('click', '.delete_item', function () {
        delete_item(this);
    });
}(jQuery));