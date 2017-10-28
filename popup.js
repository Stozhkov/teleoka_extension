function notShowDateOfLock() {

    document.getElementById("date_of_lock_label").style.display = "none";
    document.getElementById("date_of_lock").style.display = "none";

}

function notShowDayBeforeLock() {

    document.getElementById("day_before_lock_label").style.display = "none";
    document.getElementById("day_before_lock").style.display = "none";

}

function notShowSumma() {

    document.getElementById("summa").style.display = "none";
    document.getElementById("summa_label").style.display = "none";

}

function notShowBonus() {

    document.getElementById("bonus").style.display = "none";
    document.getElementById("bonus_label").style.display = "none";

}

function notShowDeposit() {

    document.getElementById("deposit").style.display = "none";
    document.getElementById("deposit_label").style.display = "none";

}

function notShowMonthlyPay() {

    document.getElementById("monthly_pay_label").style.display = "none";
    document.getElementById("monthly_pay").style.display = "none";

}

function notShowPacket() {

    document.getElementById("packet_label").style.display = "none";
    document.getElementById("packet").style.display = "none";

}

function setBadgeText(amountDays) {

    if (amountDays == "X") {
        chrome.browserAction.setBadgeBackgroundColor({ color: [204, 0, 0, 255] });
        chrome.browserAction.setBadgeText({text: amountDays.toString()});
    } else if (amountDays == "!") {
        chrome.browserAction.setBadgeBackgroundColor({ color: [204, 0, 0, 255] });
        chrome.browserAction.setBadgeText({text: amountDays.toString()});
    } else {
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

function loadDataFromServer() {

    var uid = document.getElementById("uid_input").value;
    var password = document.getElementById("password_input").value;



    if ((uid != "") && (password != "")) {

        var xhr = new XMLHttpRequest();

        xhr.open("POST", "http://abonent.teleoka.su/chrome-extensions-gate.php", true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.timeout = 5000;

        document.getElementById("users_data").style.display = "none";
        document.getElementById("waitBlock").style.display = "block";

        xhr.onreadystatechange = function() {

            if (xhr.readyState == 4)
            {
                document.getElementById("waitBlock").style.display = "none";
                document.getElementById("users_data").style.display = "block";

                if (xhr.status != 200 ) {
                    document.getElementById("users_data").style.display = "none";
                    document.getElementById("statusMessage").style.display = "block";
                    document.getElementById("statusMessage").innerHTML = "<center><b>Ошибка</b></center>" +
                        "Нет подключения к серверу.<hr width='95%'> ";
                } else {

                    var json = xhr.responseText;

                    if (JSON.parse(json).state == 0) {

                        document.getElementById("users_data").style.display = "none";
                        document.getElementById("statusMessage").style.display = "block";
                        document.getElementById("statusMessage").innerHTML = "<center><b>Ошибка.</b></center>" +
                            "Неверно введен номер договора или пароль.<hr width='95%'> ";
                        document.getElementById("payImage").style.display = "none";
                        document.getElementById("accountImage").style.display = "none";

                    } else if (JSON.parse(json).state == 1) {

                        if(JSON.parse(json).blocked == 1) {
                            document.getElementById("statusMessage").style.display = "block";
                            document.getElementById("statusMessage").innerHTML = "<center><b>Интернет заблокирован</b></center>" +
                                "Доступ в интернет заблокирован свяжитесь с администратором.<hr width='95%'> ";
                            notShowDayBeforeLock();
                            notShowDateOfLock();
                        }

                        document.getElementById("uid").innerHTML = JSON.parse(json).uid;
                        document.getElementById("packet").innerHTML = JSON.parse(json).packet;
                        document.getElementById("monthly_pay").innerHTML = JSON.parse(json).monthly_pay + " руб.";
                        document.getElementById("address").innerHTML = JSON.parse(json).address;
                        document.getElementById("deposit").innerHTML = JSON.parse(json).deposit + " руб.";
                        document.getElementById("bonus").innerHTML = JSON.parse(json).bonus + " руб.";
                        document.getElementById("summa").innerHTML = JSON.parse(json).summa + " руб.";
                        document.getElementById("day_before_lock").innerHTML = JSON.parse(json).day_before_lock;
                        document.getElementById("date_of_lock").innerHTML = JSON.parse(json).date_of_lock;
                        document.getElementById("hash").value = JSON.parse(json).hash;

                        if(JSON.parse(json).blocked == 1) {
                            setBadgeText("!");
                        }
                        else {
                            setBadgeText(JSON.parse(json).day_before_lock);
                        }

                    } else if (JSON.parse(json).state == 2) {

                        document.getElementById("statusMessage").style.display = "block";
                        document.getElementById("statusMessage").innerHTML = "<center><b>Договор расторгнут.</b></center>" +
                            "Для возобновления доступа в Интернет необходимо заключить договор. Свяжитесь с администраторм.<hr width='95%'> ";
                        document.getElementById("uid").innerHTML = JSON.parse(json).uid;
                        document.getElementById("address").innerHTML = JSON.parse(json).address;
                        document.getElementById("payImage").style.display = "none";
                        document.getElementById("accountImage").style.display = "none";

                        notShowPacket();
                        notShowMonthlyPay();
                        notShowDeposit();
                        notShowBonus();
                        notShowSumma();
                        notShowDayBeforeLock();
                        notShowDateOfLock();
                        setBadgeText("X");

                    } else if (JSON.parse(json).state == 3) {

                        document.getElementById("statusMessage").style.display = "block";
                        document.getElementById("statusMessage").innerHTML = "<center><b>Корпоративный тариф.</b></center>" +
                            " Доступ в интернет предоставляется бесплатно.<hr width='95%'> ";
                        document.getElementById("uid").innerHTML = JSON.parse(json).uid;
                        document.getElementById("address").innerHTML = JSON.parse(json).address;
                        document.getElementById("payImage").style.display = "none";
                        document.getElementById("hash").value = JSON.parse(json).hash;

                        notShowPacket();
                        notShowMonthlyPay();
                        notShowDeposit();
                        notShowBonus();
                        notShowSumma();
                        notShowDayBeforeLock();
                        notShowDateOfLock();
                        setBadgeText(0);

                    }  else if (JSON.parse(json).state == 4) {

                        document.getElementById("users_data").style.display = "block";
                        document.getElementById("statusMessage").style.display = "block";
                        document.getElementById("statusMessage").innerHTML = "<center><b>Денег на счету нет</b></center>" +
                            "Для возобнавления доступа в интернет необходимо пополнить лицевой счет.<hr width='95%'>";
                        document.getElementById("uid").innerHTML = JSON.parse(json).uid;
                        document.getElementById("packet").innerHTML = JSON.parse(json).packet;
                        document.getElementById("monthly_pay").innerHTML = JSON.parse(json).monthly_pay + " руб.";
                        document.getElementById("address").innerHTML = JSON.parse(json).address;
                        document.getElementById("deposit").innerHTML = JSON.parse(json).deposit + " руб.";
                        document.getElementById("bonus").innerHTML = JSON.parse(json).bonus + " руб.";
                        document.getElementById("summa").innerHTML = JSON.parse(json).summa + " руб.";
                        notShowDayBeforeLock();
                        notShowDateOfLock();
                        setBadgeText("!");

                    }
                }
            }
        }
        xhr.send("uid="
            + uid +"&password="
            + password +"&version="
            + chrome.app.getDetails().version +"&r="
            + Math.random());
    } else {
        document.getElementById("users_data").style.display = "none";
        document.getElementById("links").style.display = "none";
        document.getElementById("waitBlock").style.display = "none";
        document.getElementById("statusMessage").style.display = "block";
        document.getElementById("config_data").style.display = "block";
        document.getElementById("statusMessage").innerHTML = "<center><b>Приложение не настроено</b></center>" +
            " Перед началом работы, необходимо ввести номер лицевого счета и пароль с договора.<hr width='95%'>";
    }
}

function load() {
    chrome.storage.sync.get('userUID', function (result) {

        if(result.userUID) {

            document.getElementById("uid_input").value = result.userUID;

        } else {

            document.getElementById("uid_input").value = "";

        }
    });

    chrome.storage.sync.get('userPassword', function (result) {

        if(result.userPassword) {

            document.getElementById("password_input").value = result.userPassword;

        } else {

            document.getElementById("password_input").value = "";

        }

        loadDataFromServer();
    });
}

function showOrHideConfig() {
    if (document.getElementById("config_data").style.display == "none") {
        document.getElementById("img").src = "return.png";
        document.getElementById("users_data").style.display = "none";
        document.getElementById("links").style.display = "none";
        document.getElementById("config_data").style.display = "block";
        document.getElementById("statusMessage").style.display = "none";
        document.getElementById("infoMessage").style.display = "none";
    } else {
        document.getElementById("img").src = "icons-settings.png";
        document.getElementById("users_data").style.display = "block";
        document.getElementById("links").style.display = "block";
        document.getElementById("config_data").style.display = "none";
        document.getElementById("infoMessage").style.display = "none";
    }
}

function showOrHideInfo() {
    if (document.getElementById("infoMessage").style.display == "none") {
        document.getElementById("infoMessage").style.display = "block";
        document.getElementById("config_data").style.display = "none";
        document.getElementById("users_data").style.display = "none";
        document.getElementById("statusMessage").style.display = "none";
        document.getElementById("what").src = "return.png";
        document.getElementById("img").style.display = "none";
    } else {
        document.getElementById("infoMessage").style.display = "none";
        document.getElementById("users_data").style.display = "block";
        document.getElementById("what").src = "what.png";
        document.getElementById("what").style.display = "block";
        document.getElementById("img").style.display = "block";

    }
}

function showOrHidePassword() {
    if (document.getElementById("password_input").type == "password") {
        document.getElementById("password_input").type = "text";
    } else {
        document.getElementById("password_input").type = "password";
    }
}

function saveConfig() {
    chrome.storage.sync.set({ userUID: document.getElementById("uid_input").value });
    chrome.storage.sync.set({ userPassword: document.getElementById("password_input").value });
    location.reload(true)
}

document.addEventListener('DOMContentLoaded', function () {

    var links = document.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
        (function () {
            var ln = links[i];
            var location = ln.href;
            ln.onclick = function () {
                chrome.tabs.create({active: true, url: location});
            };
        })();
    }
    var img = document.getElementById("img");
    img.addEventListener('click', function () {
        showOrHideConfig();
    });

    var payImage = document.getElementById("payImage");
    payImage.addEventListener('click', function () {
        var form = document.createElement("form");
        var element1 = document.createElement("INPUT");

        form.method = "POST";
        form.action = "http://pay.teleoka.su";
        form.target = "_blank";

        element1.setAttribute("name", "uid_ext");
        element1.setAttribute("type", "hidden");
        element1.setAttribute("value", document.getElementById("uid_input").value);

        form.appendChild(element1);
        document.body.appendChild(form);

        form.submit();
    });

    var siteImage = document.getElementById("siteImage");
    siteImage.addEventListener('click', function () {
        var form = document.createElement("form");

        form.method = "POST";
        form.action = "http://телеока.рф";
        form.target = "_blank";

        document.body.appendChild(form);

        form.submit();
    });

    var speedTestImage = document.getElementById("speedTestImage");
    speedTestImage.addEventListener('click', function () {
        var form = document.createElement("form");

        form.method = "POST";
        form.action = "http://teleoka.speedtestcustom.com/";
        form.target = "_blank";

        document.body.appendChild(form);

        form.submit();
    });

    var accountImage = document.getElementById("accountImage");
    accountImage.addEventListener('click', function () {
        var form = document.createElement("form");
        var element1 = document.createElement("INPUT");
        var element2 = document.createElement("INPUT");
        var element3 = document.createElement("INPUT");

        form.method = "POST";
        form.action = "http://abonent.teleoka.su";
        form.target = "_blank";

        element1.setAttribute("name", "uid");
        element1.setAttribute("type", "hidden");
        element1.setAttribute("value", document.getElementById("uid_input").value);

        element2.setAttribute("name", "hash");
        element2.setAttribute("type", "hidden");
        element2.setAttribute("value", document.getElementById("hash").value);

        element3.setAttribute("name", "ext");
        element3.setAttribute("type", "hidden");
        element3.setAttribute("value", "1");

        form.appendChild(element1);
        form.appendChild(element2);
        form.appendChild(element3);
        document.body.appendChild(form);

        form.submit();
    });

    var what = document.getElementById("what");
    what.addEventListener('click', function () {
        showOrHideInfo();
    });

    var saveBtn = document.getElementById("saveBtn");
    saveBtn.addEventListener('click', function () {
        saveConfig();
    })

    var what = document.getElementById("showOrHidePassword");
    what.addEventListener('click', function () {
        showOrHidePassword();
    });
});

load();