var btnLogin = document.querySelector('.autorization');

var login = document.querySelector('#login');
var password = document.querySelector('#password');

var checkbox = document.querySelector('.checkbox');

btnLogin.onclick = function () {
    if (login.value === '' || password.value === '') {
        alert('Пожалуйста заполните все поля.');
    } else {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://tableco.ad-best.ru/php/login.php");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 & xhr.status == 200) {
                if (xhr.responseText == 1) {
                    if (checkbox.checked == true) {
                        localStorage.setItem("login", login.value);
                        localStorage.setItem("password", password.value);
                    }
                    xhr.open("get", "../Pages/main.html");
                    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState == 4 & xhr.status == 200) {
                            try {
                                mainView.innerHTML = xhr.responseText;
                                loadingBlock.style.display = "none";
                            } catch(ex) {
                                
                            }

                        }
                    }
                    xhr.send();
                } else {
                    alert(xhr.responseText);
                }
            }
        }
        xhr.send("login=" + login.value + "&password=" + password.value);
    }
};
