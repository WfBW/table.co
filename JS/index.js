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
    
    // список проектов
    var projectList;
    
    ////////////////////////////
    //   служебные функции   //
    function showInputsError(text, time) {
        alertBlock.innerHTML = text;

        alertBlock.style.visibility = "visible";

        setTimeout(function () {
            alertBlock.style.visibility = "hidden";
        }, time * 1000);
    };
    
    function proj(idProj, nameProj, tzProj, dateDead, idUser, idOrg, imp) {
        this.idProj = idProj;
        this.nameProj = nameProj;
        this.tzProj = nameProj;
        this.dateDead = dateDead;
        this.idUser = idUser;
        this.idOrg = idOrg;
        this.imp = imp;
    };
    
    function ajax(metod, link, asink, data, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open(metod, link, asink);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            loadingBlock.style.display = "block";
            if (xhr.readyState == 4) {
                loadingBlock.style.display = "none";
                if (xhr.status == 200) {
                    callback(xhr.responseText);
                } else {
                    showInputsError("Ошибка загрузки...", 5);
                }
            }
        }
        xhr.send(data);
    };
    //  конец служебных ф-й  //
    //////////////////////////
    
     //////////////////////////
    //         ФУНКЦИИ      //
    // открытие главного окна
    function mainHtml() {
        // блок в index.html
        var xhr = new XMLHttpRequest();
        xhr.open("get", "../Pages/main.html");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                mainView.innerHTML = xhr.responseText;
                
                var mainProjectBlock = document.querySelector(".projectList");
                var backProjMore = document.querySelector("#mainBackProjMore");
                var mainProjMore = document.querySelector(".main-project-more");
                
                // создание элемекнта списка проектов
                function projItem (container, projId) {
                    container.innerHTML +=
                    "<div class=\"block-content\">"+
                        "<div class=\"title-block\">"+
                            "<img class=\"proj-mark\" src=\"../IMG/mark.svg\">"+
                            "<span class=\"caption\">"+ projId.name +"</span>"+
                            "<hr>"+
                            "<span class=\"name-company text14gray\">"+ projId.org +"</span>"+
                        "</div>"+
                        "<div class=\"deadline\">"+
                            "<span class=\"caption\">Дедлайн:</span>"+
                            "<span class=\"dead-date\">"+ projId.date +"</span>"+
                        "</div>"+
//                        "<div class=\"manager\">"+
//                            "Менеджер проекта: <span class=\"manager-name\">Ефимов Пётр</span>"+
//                        "</div>"+
                        "<div class=\"tz\">"+
                            "<span class=\"caption\">Техническое задание:</span>"+
                            "<p class=\"tz-text\">"+ projId.tz +"</p>"+
                        "</div>"+
                        "<button class=\"btn-content\" id=\"proj"+ projId.id_proj +"\">Подробнее...</button>"+
                    "</div>";
                    document.querySelector("#proj"+projId.id_proj).onclick = function(){
                        projMore(projId.id_proj, projId);  
                    };
                };
                
                //подробнее о проекте
                function projMore (idProj, proj) {
                    var
                        titleProj = document.querySelector("#mainProjMoreTitle"),
                        companyProj = document.querySelector("#mainNameCompany"),
                        deadProj = document.querySelector("#mainProjMoreDead"),
                        tzProj = document.querySelector("#mainProjMoreTZ"),
                        complTask = document.querySelector("#mainTaskComplit"),
                        countTask = document.querySelector("#mainTaskCount"),
                        mainTaskList = document.querySelector("#mainProjMoreList");
                    
                    titleProj.innerHTML = proj.name;
                    companyProj.innerHTML = proj.org;
                    deadProj.innerHTML = proj.date;
                    tzProj.innerHTML = proj.tz;
                    
                    mainProjectBlock.style.display = "none";
                    mainProjMore.style.display = "block";
                }
                
                backProjMore.onclick = function() {
                    mainProjMore.style.display = "none";
                    mainProjectBlock.style.display = "block";
                };
                
                //начало ajax получение проектов
                ajax("POST", "http://tableco.ad-best.ru/php/proj/getProjData.php", false, 
                     "login="+user.login+"&password="+user.password, function(response) {
                    // ответ сервера в формате JSON
                    projectList = JSON.parse(response);
                    
                    //контейнер с проектами
                    var myProj = document.querySelector(".myProj");
                    //контейнер с управлением
                    var myProjControl = document.querySelector(".myProjControl");
                    
                    var caruselHuakin = document.querySelector(".carusel-huakin");
                    
                    for(var i=0; i < projectList[0].length; i++) {
                        projItem(myProj, projectList[0][i]);
                        caruselHuakin.style.width = (caruselHuakin.offsetWidth + 361) + "px";
                    }
                    
                    for(var i=0; i < projectList[1].length; i++) {
                        projItem(myProjControl, projectList[1][i]);
                        caruselHuakin.style.width = (caruselHuakin.offsetWidth + 361) + "px";
                    }
                });
                //конец ajax
                
                loadingBlock.style.display = "none";

                /////////////////////////////
                //ОТКРЫТИЕ БОКОВЫХ ВКЛАДОК//
                var
                    btnProject = document.querySelector(".project"),
                    btnTask = document.querySelector(".task"),
                    btnOrganization = document.querySelector(".organization"),
                    mainTaskBlock = document.querySelector(".main-task-block"),
                    mainOrganizationBlock = document.querySelector(".main-organization-block");

                // вкладка задачи
                btnTask.onclick = function () {
                    mainOrganizationBlock.style.display = "none";
                    mainProjectBlock.style.display = "none";
                    mainTaskBlock.style.display = "block";
                    btnProject.classList.remove("active");
                    btnTask.classList.add("active");
                    btnOrganization.classList.remove("active");
                    mainProjMore.style.display = "none";
                }
                // вкладка организации
                btnOrganization.onclick = function () {
                    mainProjectBlock.style.display = "none";
                    mainTaskBlock.style.display = "none";
                    mainOrganizationBlock.style.display = "block";
                    btnProject.classList.remove("active");
                    btnTask.classList.remove("active");
                    btnOrganization.classList.add("active");
                    mainProjMore.style.display = "none";
                }
                // вкладка проекты
                btnProject.onclick = function () {
                    mainOrganizationBlock.style.display = "none";
                    mainTaskBlock.style.display = "none";
                    mainProjectBlock.style.display = "block";
                    btnProject.classList.add("active");
                    btnTask.classList.remove("active");
                    btnOrganization.classList.remove("active");
                    mainProjMore.style.display = "none";
                }
                //      КОНЕЦ ВКЛАДОК     //
                ////////////////////////////

                //Кнопка аватара
                var btnProfile = document.querySelector(".avatar");
                btnProfile.onclick = function openProfile() {
                    var xhr = new XMLHttpRequest();
                    xhr.open("get", "../Pages/modalPages/profile.html");
                    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState == 4 && xhr.status == 200) {
                            modal.innerHTML = xhr.responseText;
                            loadingBlock.style.display = "none";
                            modal.style.display = "block"
                            
                            var btnCloseProfile = document.querySelector(".modal-close-btn");
                            btnCloseProfile.onclick = function () {
                                modal.style.display = "none";
                            }
                        }
                    }
                    xhr.send();
                };
            }
        };//конец ajax main.html
        xhr.send();
    }; //конец функции mainHtml
    
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
                var checkbox = document.querySelector('.checkbox-remember');
                
                btnLogin.onclick = function () {
                    if (login.value === '' || password.value === '') {
                        showInputsError("Заполните поля", 3);
                    } else {
                        ajax("POST", "http://tableco.ad-best.ru/php/login.php", true, 
                             "login=" + login.value + "&password=" + password.value, function (e){
                            if (e == 1) {
                                if (checkbox.checked == true) {
                                    localStorage.setItem("login", login.value);
                                    localStorage.setItem("password", password.value);
                                }
                                ajax("GET", "../Pages/main.html", true, "", function(response) {
                                    user.login = login.value;
                                    user.password = password.value;
                                    mainView.innerHTML = response;
                                    mainHtml();
                                });
                            }
                        });
                    }
                };
            }
        }
        xhr.send();
    };//конец функции loginHtml

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