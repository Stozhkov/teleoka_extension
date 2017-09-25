function setBadgeText(amountDays, blocked) {

    if (amountDays == "X") {
        chrome.browserAction.setBadgeBackgroundColor({ color: [204, 0, 0, 255] });
        chrome.browserAction.setBadgeText({text: amountDays.toString()});
    } else if (amountDays == "!") {
        chrome.browserAction.setBadgeBackgroundColor({ color: [204, 0, 0, 255] });
        chrome.browserAction.setBadgeText({text: amountDays.toString()});
    } else {

        if(blocked == 1) {
            chrome.browserAction.setBadgeBackgroundColor({ color: [204, 0, 0, 255] });
            chrome.browserAction.setBadgeText({text: "!"});
        }
        else {
            if (amountDays == 0) {
                chrome.browserAction.setBadgeText({text: ""});
            }
            else if ((amountDays < 6) && (amountDays > 0)) {
                chrome.browserAction.setBadgeText({text: amountDays.toString()});
                chrome.browserAction.setBadgeBackgroundColor({ color: [204, 0, 0, 255] });
            } else {
                chrome.browserAction.setBadgeText({text: amountDays.toString()});
                chrome.browserAction.setBadgeBackgroundColor({ color: [128, 128, 128, 255] });
            }
        }
    }
}

function loadDataFromServer() {

    var uid = userData.uid;
    var password = userData.pwd;



    if ((uid != "") && (password != "")) {

        var xhr = new XMLHttpRequest();

        xhr.open("POST", "http://abonent.teleoka.su/chrome-extensions-gate.php", true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.timeout = 5000;

        xhr.onreadystatechange = function() {

            if (xhr.readyState == 4)
            {

                if (xhr.status == 200 ) {

                    var json = xhr.responseText;

                    if (JSON.parse(json).state == 1) {

                        setBadgeText(JSON.parse(json).day_before_lock, JSON.parse(json).blocked);

                    }
                }
            }
        }
        xhr.send("uid="
            + uid +"&password="
            + password +"&version="
            + chrome.app.getDetails().version +"&r="
            + Math.random());
    }
}

function load() {
    chrome.storage.sync.get('userUID', function (result) {

        if(result.userUID) {

            userData.uid = result.userUID;

        }
    });

    chrome.storage.sync.get('userPassword', function (result) {

        if(result.userPassword) {

           userData.pwd = result.userPassword;

        }

        loadDataFromServer();
    });
}

var userData = new Object();
userData.uid = "";
userData.pwd = "";

chrome.alarms.onAlarm.addListener(function() {
    load();
});

chrome.alarms.create('', { periodInMinutes: 120 });

chrome.browserAction.setBadgeText({text: ""});

load();
