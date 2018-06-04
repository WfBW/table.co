document.addEventListener("DOMContentLoaded", function () {
    //Окно просмотра
    var mainView = document.querySelector(".mainView");
    //Модальное окно
    var modal = document.querySelector(".modal");
    //Блок загрузки
    var loadingBlock = document.querySelector(".loadingBlock");
    //Блок сообщения
    var alertBlock = document.querySelector(".index-alert-block");
    
    var user = {
        login: null,
        password: null
    };

    ////////////////////////////
    //   служебные функции   //
    function showInputsError(text, time) {
        alertBlock.innerHTML = text;

        alertBlock.style.visibility = "visible";

        setTimeout(function () {
            alertBlock.style.visibility = "hidden";
        }, time * 1000);
    }
    
//    function ajax(metod, link, asink, data, callback) {
//        var xhr = new XMLHttpRequest();
//        xhr.open(metod, link, asink);
//        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
//        xhr.onreadystatechange = function () {
//            loadingBlock.style.display = "block";
//            if (xhr.readyState == 4) {
//                loadingBlock.style.display = "none";
//                if (xhr.status == 200) {
//                    callback(xhr.responseText);
//                } else {
//                    showInputsError("Ошибка загрузки...", 5);
//                }
//            }
//        } xhr.send(data);
//    };
    //  конец служебных ф-й  //
    //////////////////////////
    
     //////////////////////////
    //         ФУНКЦИИ      //
    // открытие главного окна
    function mainHtml () {
        // блок в index.html
        var xhr = new XMLHttpRequest();
        xhr.open("get", "../Pages/main.html");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                mainView.innerHTML = xhr.responseText;
                loadingBlock.style.display = "none";
                
                /////////////////////////////
                //ОТКРЫТИЕ БОКОВЫХ ВКЛАДОК//
                var 
                    btnProject = document.querySelector(".project"),
                    btnTask = document.querySelector(".task"),
                    btnOrganization = document.querySelector(".organization"),
                    mainTaskBlock = document.querySelector(".main-task-block"),    
                    mainOrganizationBlock = document.querySelector(".main-organization-block"),    
                    mainProjectBlock = document.querySelector(".main-project-block");    

                    // вкладка задачи
                    btnTask.onclick = function () {
                        mainOrganizationBlock.style.display = "none";
                        mainProjectBlock.style.display = "none";
                        mainTaskBlock.style.display = "block";
                        btnProject.classList.remove("active");
                        btnTask.classList.add("active");
                        btnOrganization.classList.remove("active");
                    }
                    // вкладка организации
                    btnOrganization.onclick = function () {
                        mainProjectBlock.style.display = "none";
                        mainTaskBlock.style.display = "none";
                        mainOrganizationBlock.style.display = "block";
                        btnProject.classList.remove("active");
                        btnTask.classList.remove("active");
                        btnOrganization.classList.add("active");
                    }
                    // вкладка проекты
                    btnProject.onclick = function () {
                        mainOrganizationBlock.style.display = "none";
                        mainTaskBlock.style.display = "none";
                        mainProjectBlock.style.display = "block";
                        btnProject.classList.add("active");
                        btnTask.classList.remove("active");
                        btnOrganization.classList.remove("active");
                    }
                //      КОНЕЦ ВКЛАДОК     //
                ////////////////////////////

            }
        };
        xhr.send();
    };
    
    function loginHtml() {
        var xhr = new XMLHttpRequest();
        xhr.open("get", "../Pages/login.html");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 & xhr.status == 200) {
                mainView.innerHTML = xhr.responseText;
                loadingBlock.style.display = "none";
                
                var regBlock = document.querySelector(".login-registration-block");
                var autBlock = document.querySelector(".login-autorization-block");
                var loginBackBtn = document.querySelector(".reg-back-btn");
                
                // кнопка назад в окне регистрации
                loginBackBtn.onclick = function () {
                    autBlock.style.display = "block";
                    regBlock.style.display = "none";
                }
                
                ////////////////////////////////////////
                //Регистрация                        //
               ///////////////////////////////////////
                var btnReg = document.querySelector(".registration");
                btnReg.onclick = function () {
                    autBlock.style.display = "none";
                    regBlock.style.display = "block";
                    
                    var btnSt1 = document.querySelector(".btn-st1");
                    var btnSt2 = document.querySelector(".btn-st2");
                    var btnReg = document.querySelector(".btn-st3");

                    var name = document.querySelector("#name");
                    var fname = document.querySelector("#fname");
                    var otch = document.querySelector("#otch");
                    var bday = document.querySelector("#bday");

                    var login = document.querySelector("#loginReg");
                    var password1 = document.querySelector("#password1");
                    var password2 = document.querySelector("#password2");
                    var password = '';
                    var email = document.querySelector("#email");

                    //var specialty = document.querySelector("#specialty");
                    var tel = document.querySelector("#tel");
                    var social = document.querySelector("#social");
                    var about = document.querySelector("#about");

                    btnSt1.onclick = function () {
                        var st1 = document.querySelector(".stage-1");
                        var st2 = document.querySelector(".stage-2");

                        if (name.value != '' || fname.value != '' || otch.value != '' || bday.value != '') {
                            st1.style.display = "none";
                            st2.style.display = "block";

                        } else {
                            showInputsError("Заполните поля", 3);
                        }
                    }

                    btnSt2.onclick = function () {
                        var st2 = document.querySelector(".stage-2");
                        var st3 = document.querySelector(".stage-3");

                        if (login.value != '' || password1.value != '' || password2.value != '' || email.value != '') {
                            if (password1.value === password2.value) {
                                password = password1;
                                st2.style.display = "none";
                                st3.style.display = "block";
                            } else {
                                showInputsError("Пароли не совпадают", 3);
                            }
                        } else {
                            showInputsError("Заполните поля", 3);
                        }
                    }

                    btnReg.onclick = function () {
                        var st2 = document.querySelector(".stage-2");
                        var st3 = document.querySelector(".stage-3");

                        if (tel.value != '') {
                            var xhr = new XMLHttpRequest();
                            xhr.open("POST", "http://tableco.ad-best.ru/php/reg.php");
                            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                            xhr.onreadystatechange = function () {
                                if (xhr.readyState == 4 & xhr.status == 200) {
                                    if (xhr.responseText == 1) {
                                        user.login = login.value;
                                        user.password = password.value;
                                        mainHtml();
                                    } else {
                                        showInputsError(xhr.responseText, 3);
                                    }
                                }
                            }
                            xhr.send("name=" + name.value + "&fname=" + fname.value + "&otchestvo=" + otch.value + "&about=" + about.value + "&mail=" + email.value + "&phone=" + tel.value + "&login=" + login.value + "&password=" + password.value + "&social=" + social.value + "&bdate=" + bday.value);

                        } else {
                            showInputsError("Заполните поля",3);
                        }
                        mainView.innerHTML = xhr.responseText;
                    }
                };

                 //////////////////////////////////////
                //      Вход                        //
               //////////////////////////////////////
                var btnLogin = document.querySelector('.autorization');
                var login = document.querySelector('#login');
                var password = document.querySelector('#password');
                var checkbox = document.querySelector('.checkbox');
                
                btnLogin.onclick = function () {
                    if (login.value === '' || password.value === '') {
                        showInputsError("Заполните поля", 3);
                    } else {
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
                                            user.login = login.value;
                                            user.password = password.value;
                                            
                                            mainView.innerHTML = xhr.responseText;
                                            loadingBlock.style.display = "none";
                                            mainHtml();
                                        }
                                    }
                                    xhr.send();
                                } else {
                                    alert(xhr.responseText);
                                }
                            }
                        }
                        xhr.send("login=" + login.value + "&password=" + password.value);
//                        ajax("POST", "http://tableco.ad-best.ru/php/login.php", false, 
//                             "login=" + login.value + "&password=" + password.value, function (){
//                            if (xhr.responseText == 1) {
//                                if (checkbox.checked == true) {
//                                    localStorage.setItem("login", login.value);
//                                    localStorage.setItem("password", password.value);
//                                }
//                                ajax("GET", "../Pages/main.html", false, "", function(response) {
//                                    user.login = login.value;
//                                    user.password = password.value;
//                                    mainView.innerHTML = response;
//                                    mainHtml();
//                                });
//                            }
//                        });
                    }
                };
            }
        }
        xhr.send();
    }
    //     КОНЕЦ ФУНКЦИИ   //
    /////////////////////////

    // проверка локал стораж 
    if (localStorage.getItem("login") == null || localStorage.getItem("password") == null) {
        loginHtml();
    } else {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://tableco.ad-best.ru/php/login.php");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 & xhr.status == 200) {
                if (xhr.responseText == 1) {
                    xhr.open("get", "../Pages/main.html");
                    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState == 4 & xhr.status == 200) {
                            mainView.innerHTML = xhr.responseText;
                            loadingBlock.style.display = "none";
                            
                            user.login = localStorage.getItem("login");
                            user.password = localStorage.getItem("password");
                            mainHtml();
                        }
                    }
                    xhr.send();
                } else {
                    loginHtml();
                }
            }
        }
        xhr.send("login=" + localStorage.getItem("login") + "&password=" + localStorage.getItem("password"));
    }
    // конец localeStorage
});

//нажатие на регистрацию
