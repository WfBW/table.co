document.addEventListener("DOMContentLoaded", function () {
    //Окно просмотра
    var mainView = document.querySelector(".mainView");

    //Модальное окно
    var modal = document.querySelector(".modal");

    //Блок загрузки
    var loadingBlock = document.querySelector(".loadingBlock");

    /////////////////////////////
    //ОТКРЫТИЕ БОКОВЫХ ВКЛАДОК//
    ////////////////////////////
    var mainHtml = function () {
        var btnProject = document.querySelector(".project");
        var btnTask = document.querySelector(".task");
        var btnOrganization = document.querySelector(".organization");

        var mainPageView = document.querySelector(".mainPageView");
        var loadingPageBlock = document.querySelector(".loadingPageBlock");

        // нажатие на вкладку проекты
        btnProject.onclick = function () {
            var xhr = new XMLHttpRequest();
            xhr.open("get", "../Pages/project.html");
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 & xhr.status == 200) {
                    mainPageView.innerHTML = xhr.responseText;
                    loadingPageBlock.style.display = "none";
                    btnProject.classList.add("active");
                    btnTask.classList.remove("active");
                    btnOrganization.classList.remove("active");

                    // функция нажатия на кнопку ПОДРОБНЕЕ в проект
                    var btnMore = document.querySelector(".btn-content");
                    if (btnMore != undefined)
                        btnMore.onclick = function () {
                            var xhr = new XMLHttpRequest();
                            xhr.open("get", "../Pages/project_more.html");
                            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                            xhr.onreadystatechange = function () {
                                if (xhr.readyState == 4 & xhr.status == 200) {
                                    mainPageView.innerHTML = xhr.responseText;
                                    loadingPageBlock.style.display = "none";
                                }
                            }
                            xhr.send();
                        };
                }
            }
            xhr.send();
        };

        btnProject.onclick();

        // нажатие на вкладку задачи
        btnTask.onclick = function () {
            var xhr = new XMLHttpRequest();
            xhr.open("get", "../Pages/task.html");
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 & xhr.status == 200) {
                    mainPageView.innerHTML = xhr.responseText;
                    loadingPageBlock.style.display = "none";
                    btnProject.classList.remove("active");
                    btnTask.classList.add("active");
                    btnOrganization.classList.remove("active");
                }
            }
            xhr.send();
        };

        //нажатие на вкладку организации
        btnOrganization.onclick = function () {
            var xhr = new XMLHttpRequest();
            xhr.open("get", "../Pages/organization.html");
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 & xhr.status == 200) {
                    mainPageView.innerHTML = xhr.responseText;
                    loadingPageBlock.style.display = "none";
                    btnProject.classList.remove("active");
                    btnTask.classList.remove("active");
                    btnOrganization.classList.add("active");
                }
            }
            xhr.send();
        };
    };



    // проверка локал стораж 
    if (localStorage.getItem("login") == null || localStorage.getItem("password") == null) {
        var xhr = new XMLHttpRequest();
        xhr.open("get", "../Pages/autorization.html");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 & xhr.status == 200) {
                mainView.innerHTML = xhr.responseText;
                loadingBlock.style.display = "none";

                var btnReg = document.querySelector(".registration");

                btnReg.onclick = function () {
                    xhr.open("GET", "../Pages/registration.html");
                    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                    xhr.onreadystatechange = function () {
                        if (xhr.status == 200 & xhr.readyState == 4) {
                            mainView.innerHTML = xhr.responseText;

                            ////////////////////////////////////////
                            //Регистрация                        //
                            ///////////////////////////////////////

                            var btnSt1 = document.querySelector(".btn-st1");
                            var btnSt2 = document.querySelector(".btn-st2");
                            var btnReg = document.querySelector(".btn-st3");

                            var name = document.querySelector("#name");
                            var fname = document.querySelector("#fname");
                            var otch = document.querySelector("#otch");
                            var bday = document.querySelector("#bday");

                            var login = document.querySelector("#login");
                            var password1 = document.querySelector("#password1");
                            var password2 = document.querySelector("#password2");
                            var password = '';
                            var email = document.querySelector("#email");

                            var specialty = document.querySelector("#specialty");
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
                                    alert("Заполни поля");
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
                                        alert("Пароли не совпадают");
                                    }
                                } else {
                                    alert("Заполни поля2");
                                }
                            }

                            btnReg.onclick = function () {
                                var st2 = document.querySelector(".stage-2");
                                var st3 = document.querySelector(".stage-3");

                                if (specialty.value != '' || tel.value != '') {
                                    var xhr = new XMLHttpRequest();
                                    xhr.open("POST", "http://tableco.ad-best.ru/php/reg.php");
                                    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                                    xhr.onreadystatechange = function () {
                                        if (xhr.readyState == 4 & xhr.status == 200) {
                                            if (xhr.responseText == 1 | xhr.responseText == "1") {
                                                mainHtml();
                                            } else {
                                                alert(xhr.responseText);
                                            }
                                        }
                                    }
                                    xhr.send("name=" + name.value + "&fname=" + fname.value + "&otchestvo=" + otch.value + "&about=" + about.value + "&mail=" + email.value + "&phone=" + tel.value + "&login=" + login.value + "&password=" + password.value + "&social=" + social.value + "&bdate=" + bday.value);

                                } else {
                                    alert("Заполни поля");
                                }
                            }
                        }
                    }
                    xhr.send();

                }

                var btnLogin = document.querySelector('.autorization');

                var login = document.querySelector('#login');
                var password = document.querySelector('#password');

                var checkbox = document.querySelector('.checkbox');

                //проверка заполнения логина и пароля
                btnLogin.onclick = function () {
                    if (login.value === '' || password.value === '') {
                        alert('Пожалуйста заполните все поля.');
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
                    }
                };
            }
        }
        xhr.send();
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
                            mainHtml();
                        }
                    }
                    xhr.send();
                } else {
                    xhr.open("get", "../Pages/autorization.html");
                    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState == 4 & xhr.status == 200) {
                            mainView.innerHTML = xhr.responseText;
                            loadingBlock.style.display = "none";

                            var btnLogin = document.querySelector('.autorization');

                            var login = document.querySelector('#login');
                            var password = document.querySelector('#password');

                            var checkbox = document.querySelector('.checkbox');

                            // кнопка ВОЙТИ
                            btnLogin.onclick = function () {
                                if (login.value === '' || password.value === '') {
                                    alert('Пожалуйста заполните все поля.');
                                } else {
                                    alert(4);
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
                                }
                            };

                        }
                    }
                    xhr.send();
                }
            }
        }
        xhr.send("login=" + localStorage.getItem("login") + "&password=" + localStorage.getItem("password"));
    }
});

//нажатие на регистрацию
