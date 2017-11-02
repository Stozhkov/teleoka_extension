function setBadgeText(amountDays, blocked) {

    if (amountDays === "X") {
        chrome.browserAction.setBadgeBackgroundColor({ color: [204, 0, 0, 255] });
        chrome.browserAction.setBadgeText({text: amountDays.toString()});
    } else if (amountDays === "!") {
        chrome.browserAction.setBadgeBackgroundColor({ color: [204, 0, 0, 255] });
        chrome.browserAction.setBadgeText({text: amountDays.toString()});
    } else {

        if(blocked === 1) {
            chrome.browserAction.setBadgeBackgroundColor({ color: [204, 0, 0, 255] });
            chrome.browserAction.setBadgeText({text: "!"});
        }
        else {
            if (amountDays === 0) {
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

function loadDataFromServer(showNotification = false) {

    let uid = userData.uid;
    let password = userData.pwd;



    if ((uid !== "") && (password !== "")) {

        let xhr = new XMLHttpRequest();

        xhr.open("POST", "http://abonent.teleoka.su/chrome-extensions-gate.php", true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.timeout = 5000;

        xhr.onreadystatechange = function() {

            if (xhr.readyState === 4)
            {

                if (xhr.status === 200 ) {

                    let userData = JSON.parse(xhr.responseText);

                    if (userData['state'] === 1) {

                        setBadgeText(userData['day_before_lock'], userData['blocked']);

                        if (showNotification && userData['day_before_lock'] < 6) {

                            chrome.notifications.create(
                                'notification',{
                                    type: 'basic',
                                    iconUrl: '512.png',
                                    title: "Телеока",
                                    message: "Уважаеемый абонент.\nВо избежание отключения от сети Интернет, рекомендуем вам пополнить счет."
                                }
                            );

                        }

                    }
                }
            }
        };

        xhr.send("uid="
            + uid +"&password="
            + password +"&version="
            + chrome.app.getDetails().version +"&r="
            + Math.random());
    }
}

function load(showNotification = false) {
    chrome.storage.sync.get('userUID', function (result) {

        if(result['userUID']) {

            userData.uid = result['userUID'];

        }
    });

    chrome.storage.sync.get('userPassword', function (result) {

        if(result['userPassword']) {

           userData.pwd = result['userPassword'];

        }

        loadDataFromServer(showNotification);
    });
}

let userData = {};
userData.uid = "";
userData.pwd = "";

chrome.alarms.onAlarm.addListener(function() {
    load();
});

chrome.alarms.create('', { periodInMinutes: 120 });

chrome.browserAction.setBadgeText({text: ""});

load(true);
