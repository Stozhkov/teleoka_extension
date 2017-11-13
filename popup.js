function notShowDateOfLock() {

    document.getElementById("date_of_lock_label").style.display = "none";
    document.getElementById("date_of_lock").style.display = "none";

}

function notShowDayBeforeLock() {

    document.getElementById("day_before_lock_label").style.display = "none";
    document.getElementById("day_before_lock").style.display = "none";

}

function notShowSum() {

    document.getElementById("sum").style.display = "none";
    document.getElementById("sum_label").style.display = "none";

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

    if (amountDays === "X") {
        chrome.browserAction.setBadgeBackgroundColor({ color: [204, 0, 0, 255] });
        chrome.browserAction.setBadgeText({text: amountDays.toString()});
    } else if (amountDays === "!") {
        chrome.browserAction.setBadgeBackgroundColor({ color: [204, 0, 0, 255] });
        chrome.browserAction.setBadgeText({text: amountDays.toString()});
    } else {
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

function loadDataFromServer() {

    let uid = document.getElementById("uid_input").value;
    let password = document.getElementById("password_input").value;



    if ((uid !== "") && (password !== "")) {

        let xhr = new XMLHttpRequest();

        xhr.open("POST", "http://abonent.teleoka.su/chrome-extensions-gate.php", true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.timeout = 5000;

        document.getElementById("users_data").style.display = "none";
        document.getElementById("waitBlock").style.display = "block";

        xhr.onreadystatechange = function() {

            if (xhr.readyState === 4)
            {
                document.getElementById("waitBlock").style.display = "none";
                document.getElementById("users_data").style.display = "block";

                if (xhr.status !== 200 ) {
                    document.getElementById("users_data").style.display = "none";
                    document.getElementById("statusMessage").style.display = "block";
                    document.getElementById("statusMessage").innerHTML = "<b>Ошибка</b><br>" +
                        "Нет подключения к серверу.<hr width='95%'> ";
                } else {

                    let userData = JSON.parse(xhr.responseText);

                    if (userData['state'] === 0) {

                        document.getElementById("users_data").style.display = "none";
                        document.getElementById("statusMessage").style.display = "block";
                        document.getElementById("statusMessage").innerHTML = "<b>Ошибка.</b><br>" +
                            "Неверно введен номер договора или пароль.<hr width='95%'> ";
                        document.getElementById("payImage").style.display = "none";
                        document.getElementById("accountImage").style.display = "none";

                    } else if (userData['state'] === 1) {

                        if(userData['blocked'] === 1) {
                            document.getElementById("statusMessage").style.display = "block";
                            document.getElementById("statusMessage").innerHTML = "<b>Интернет заблокирован</b><br>" +
                                "Доступ в интернет заблокирован свяжитесь с администратором.<hr width='95%'> ";
                            notShowDayBeforeLock();
                            notShowDateOfLock();
                        }

                        document.getElementById("uid").innerHTML = userData['uid'];
                        document.getElementById("packet").innerHTML = userData['packet'];
                        document.getElementById("monthly_pay").innerHTML = userData['monthly_pay'] + " руб.";
                        document.getElementById("address").innerHTML = userData['address'];
                        document.getElementById("deposit").innerHTML = userData['deposit'] + " руб.";
                        document.getElementById("bonus").innerHTML = userData['bonus'] + " руб.";
                        document.getElementById("sum").innerHTML = userData['sum'] + " руб.";
                        document.getElementById("day_before_lock").innerHTML = userData['day_before_lock'];
                        document.getElementById("date_of_lock").innerHTML = userData['date_of_lock'];
                        document.getElementById("hash").value = userData['hash'];

                        if(userData['blocked'] === 1) {
                            setBadgeText("!");
                        }
                        else {
                            setBadgeText(userData['day_before_lock']);
                        }

                    } else if (userData['state'] === 2) {

                        document.getElementById("statusMessage").style.display = "block";
                        document.getElementById("statusMessage").innerHTML = "<b>Договор расторгнут.</b><br>" +
                            "Для возобновления доступа в Интернет необходимо заключить договор. Свяжитесь с администраторм.<hr width='95%'> ";
                        document.getElementById("uid").innerHTML = userData['uid'];
                        document.getElementById("address").innerHTML = userData['address'];
                        document.getElementById("payImage").style.display = "none";
                        document.getElementById("accountImage").style.display = "none";

                        notShowPacket();
                        notShowMonthlyPay();
                        notShowDeposit();
                        notShowBonus();
                        notShowSum();
                        notShowDayBeforeLock();
                        notShowDateOfLock();
                        setBadgeText("X");

                    } else if (userData['state'] === 3) {

                        document.getElementById("statusMessage").style.display = "block";
                        document.getElementById("statusMessage").innerHTML = "<b>Корпоративный тариф.</b><br>" +
                            " Доступ в интернет предоставляется бесплатно.<hr width='95%'> ";
                        document.getElementById("uid").innerHTML = userData['uid'];
                        document.getElementById("address").innerHTML = userData['address'];
                        document.getElementById("payImage").style.display = "none";
                        document.getElementById("hash").value = userData['hash'];

                        notShowPacket();
                        notShowMonthlyPay();
                        notShowDeposit();
                        notShowBonus();
                        notShowSum();
                        notShowDayBeforeLock();
                        notShowDateOfLock();
                        setBadgeText(0);

                    }  else if (userData['state'] === 4) {

                        document.getElementById("users_data").style.display = "block";
                        document.getElementById("statusMessage").style.display = "block";
                        document.getElementById("statusMessage").innerHTML = "<b>Денег на счету нет</b><br>" +
                            "Для возобнавления доступа в интернет необходимо пополнить лицевой счет.<hr width='95%'>";
                        document.getElementById("uid").innerHTML = userData['uid'];
                        document.getElementById("packet").innerHTML = userData['packet'];
                        document.getElementById("monthly_pay").innerHTML = userData['monthly_pay'] + " руб.";
                        document.getElementById("address").innerHTML = userData['address'];
                        document.getElementById("deposit").innerHTML = userData['deposit'] + " руб.";
                        document.getElementById("bonus").innerHTML = userData['bonus'] + " руб.";
                        document.getElementById("sum").innerHTML = userData['sum'] + " руб.";
                        notShowDayBeforeLock();
                        notShowDateOfLock();
                        setBadgeText("!");

                    }

                    userData = null;

                }
            }
        };

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
        document.getElementById("statusMessage").innerHTML = "<b>Приложение не настроено</b><br>" +
            " Перед началом работы, необходимо ввести номер лицевого счета и пароль с договора.<hr width='95%'>";
    }
}

function load() {
    chrome.storage.sync.get('userUID', function (result) {

        if(result['userUID']) {

            document.getElementById("uid_input").value = result['userUID'];

        } else {

            document.getElementById("uid_input").value = "";

        }
    });

    chrome.storage.sync.get('userPassword', function (result) {

        if(result['userPassword']) {

            document.getElementById("password_input").value = result['userPassword'];

        } else {

            document.getElementById("password_input").value = "";

        }

        loadDataFromServer();
    });
}

function showOrHideConfig() {
    if (document.getElementById("config_data").style.display === "none") {
        document.getElementById("settingBtn").src = "return.png";
        document.getElementById("users_data").style.display = "none";
        document.getElementById("links").style.display = "none";
        document.getElementById("config_data").style.display = "block";
        document.getElementById("statusMessage").style.display = "none";
        document.getElementById("infoMessage").style.display = "none";
    } else {
        document.getElementById("settingBtn").src = "icons-settings.png";
        document.getElementById("users_data").style.display = "block";
        document.getElementById("links").style.display = "block";
        document.getElementById("config_data").style.display = "none";
        document.getElementById("infoMessage").style.display = "none";
    }
}

function showOrHideInfo() {
    if (document.getElementById("infoMessage").style.display === "none") {
        document.getElementById("infoMessage").style.display = "block";
        document.getElementById("config_data").style.display = "none";
        document.getElementById("users_data").style.display = "none";
        document.getElementById("statusMessage").style.display = "none";
        document.getElementById("helpBtn").src = "return.png";
        document.getElementById("settingBtn").style.display = "none";
    } else {
        document.getElementById("infoMessage").style.display = "none";
        document.getElementById("users_data").style.display = "block";
        document.getElementById("helpBtn").src = "help.png";
        document.getElementById("helpBtn").style.display = "block";
        document.getElementById("settingBtn").style.display = "block";

    }
}

function showOrHidePassword() {
    if (document.getElementById("password_input").type === "password") {
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

    let links = document.getElementsByTagName("a");
    for (let i = 0; i < links.length; i++) {
        (function () {
            let ln = links[i];
            let location = ln.href;
            ln.onclick = function () {
                chrome.tabs.create({active: true, url: location});
            };
        })();
    }

    let settingBtn = document.getElementById("settingBtn");
    settingBtn.addEventListener('click', function () {
        showOrHideConfig();
    });

    let payImage = document.getElementById("payImage");
    payImage.addEventListener('click', function () {
        let form = document.createElement("form");
        let element1 = document.createElement("INPUT");

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

    let siteImage = document.getElementById("siteImage");
    siteImage.addEventListener('click', function () {
        let form = document.createElement("form");

        form.method = "POST";
        form.action = "http://телеока.рф";
        form.target = "_blank";

        document.body.appendChild(form);

        form.submit();
    });

    let speedTestImage = document.getElementById("speedTestImage");
    speedTestImage.addEventListener('click', function () {
        let form = document.createElement("form");

        form.method = "POST";
        form.action = "http://teleoka.speedtestcustom.com/";
        form.target = "_blank";

        document.body.appendChild(form);

        form.submit();
    });

    let accountImage = document.getElementById("accountImage");
    accountImage.addEventListener('click', function () {
        let form = document.createElement("form");
        let element1 = document.createElement("INPUT");
        let element2 = document.createElement("INPUT");
        let element3 = document.createElement("INPUT");

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

    let helpBtn = document.getElementById("helpBtn");
    helpBtn.addEventListener('click', function () {
        showOrHideInfo();
    });

    let saveBtn = document.getElementById("saveBtn");
    saveBtn.addEventListener('click', function () {
        saveConfig();
    });

    let showOrHidePasswordBtn = document.getElementById("showOrHidePasswordBtn");
    showOrHidePasswordBtn.addEventListener('click', function () {
        showOrHidePassword();
    });
});

load();