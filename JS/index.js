document.addEventListener("DOMContentLoaded", function () {
    //Окно просмотра
    var mainView = document.querySelector(".mainView");
    //Модальное окно
    var modal = document.querySelector(".modal");
    var modalSt2 = document.querySelector(".modalSt2");
    //Блок загрузки
    var loadingBlock = document.querySelector(".loadingBlock");
    //Блок сообщения
    var alertBlock = document.querySelector(".index-alert-block");
    
    // список с данными о текущем пользователе
    var user = {
        login: null,
        password: null
    };
    // список проектов
    var projectList;
    // список организаций
    var organizationList;
    // список задач
    var tasksList;
    
    ////////////////////////////
    //   служебные функции   //
    function showInputsError(text, time, color) {
        alertBlock.innerHTML = text;

        switch (color) {
            case 0:
                alertBlock.style.backgroundColor = "red";
                break;
            case 1:
                alertBlock.style.backgroundColor = "green";
                break;
            default:
                alertBlock.style.backgroundColor = "red";
        }
        alertBlock.style.visibility = "visible";

        setTimeout(function () {
            alertBlock.style.visibility = "hidden";
        }, time * 1000);
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
                    showInputsError("Ошибка загрузки данных...", 5);
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
                
                // определение переменных области видимости ф-ии mainHtml
                var
                    //кнопки бокового меню
                    btnProject = document.querySelector(".project"),
                    btnTask = document.querySelector(".task"),
                    btnOrganization = document.querySelector(".organization"),
                    
                    // блоки главной области отображения
                    mainTaskBlock = document.querySelector(".main-task-block"),
                    mainOrganizationBlock = document.querySelector(".main-organization-block"),
                    mainProjectBlock = document.querySelector(".projectList"),
                    
                    // модальная форма main
                    mainModalBlock = document.querySelector(".main-modal-block"),
                    
                    // подробнее о проекте
                    backProjMore = document.querySelector("#mainBackProjMore"),
                    mainProjMore = document.querySelector(".main-project-more"),
                    
                    // создание нового проекта
                    btnNewProj = document.querySelector("#proj-context-btn"),
                    mainProjNew = document.querySelector(".main-project-new"),
                    
                    // создание новой организации
                    btnNewOrg = document.querySelector(".org-context-btn"),
                    modalNewOrg = document.querySelector(".modal-create-org"),
                    
                    // список работников организации
                    workerListBlock = document.querySelector(".modal-worker-list"),
                    workerListClose = document.querySelector(".modal-workerlist-close"),
                    workerListIntoteam = document.querySelector(".modal-intoteam-btn"),
                    
                    // профиль
                    btnProfile = document.querySelector(".avatar");
                
                  /////////////////////////////
                 //   ДЕЙСТВИЯ С ПРОЕКТАМИ  //
                //подробнее о проекте
                function projMore (idProj, proj) {
                    return function () {
                        var
                            titleProj = document.querySelector("#mainProjMoreTitle"),
                            companyProj = document.querySelector("#mainNameCompany"),
                            deadProj = document.querySelector("#mainProjMoreDead"),
                            tzProj = document.querySelector("#mainProjMoreTZ"),
                            complTask = document.querySelector("#mainTaskComplit"),
                            countTask = document.querySelector("#mainTaskCount"),
                            mainTaskList = document.querySelector("#mainProjMoreList");
                        // кнопка создание новой задачи
                        var createTaskBtn = document.querySelector("#createTaskBtn");

                        titleProj.innerHTML = proj.name;
                        companyProj.innerHTML = proj.org;
                        deadProj.innerHTML = proj.date;
                        tzProj.innerHTML = proj.tz;

                        mainProjectBlock.style.display = "none";
                        mainProjMore.style.display = "block";

                        createTaskBtn.onclick = function () {
                            var nameTaskNew = document.querySelector("#nameTaskNew");
                            var dateTaskNew = document.querySelector("#dateTaskNew");
                            var impTaskNewSection = document.querySelector("#impTaskNew");
                            var workerTaskNewSection = document.querySelector("#workerTaskNew");

                            var btnNewTaskOk = document.querySelector("#ok-create-task");
                            var btnNewTaskCancel = document.querySelector("#cancel-create-task");

                            var addTaskForm = document.querySelector(".modal-addtask-form");

                            workerTaskNewSection.innerHTML = "<option value=\"\" disabled selected hidden>Выберите исполнителя...</option>";

                            ajax("POST", "http://tableco.ad-best.ru/php/tasks/getUsers.php", false,
                                "login=" + user.login + "&password=" + user.password + "&id_proj=" + idProj,
                                function (response) {
                                    var workerListNewTask = JSON.parse(response);
                                    for (var i = 0; i < workerListNewTask.length; i++) {
                                        workerTaskNewSection.innerHTML += "<option value=\"" + workerListNewTask[i].id_user + "\">" + workerListNewTask[i].fname + " " + workerListNewTask[i].name + "</option>";
                                    }
                                });

                            mainModalBlock.style.display = "block";
                            addTaskForm.style.display = "block";

                            btnNewTaskOk.onclick = function () {
                                if (nameTaskNew.value != "" && dateTaskNew.value != "" && impTaskNewSection.value != "" && workerTaskNewSection.value != "") {
                                    ajax("POST", "http://tableco.ad-best.ru/php/tasks/addTask.php", false,
                                        "login=" + user.login + "&password=" + user.password + "&nameTask=" + nameTaskNew.value +
                                        "&dateTask=" + dateTaskNew.value + "&imp=" + impTaskNewSection.value +
                                        "&id_user=" + workerTaskNewSection.value + "&id_proj=" + idProj,
                                        function (response) {
                                            addTaskForm.style.display = "none";
                                            mainModalBlock.style.display = "none";
                                            nameTaskNew.value = "";
                                            dateTaskNew.value = "";
                                            impTaskNewSection.value = "";
                                            workerTaskNewSection.value = "";

                                            generateTask();
                                        
                                            showInputsError("Задача успешно поставлена", 2, 1);
                                        });
                                } else {
                                    showInputsError("Все поля должны быть заполнены", 2);
                                }
                            };

                            btnNewTaskCancel.onclick = function () {
                                addTaskForm.style.display = "none";
                                mainModalBlock.style.display = "none";
                                nameTaskNew.value = "";
                                dateTaskNew.value = "";
                                impTaskNewSection.value = "";
                                workerTaskNewSection.value = "";
                            };
                        };

                        //назад в подробнее о проекте
                        backProjMore.onclick = function () {
                            mainProjMore.style.display = "none";
                            mainProjectBlock.style.display = "block";
                        };
                    } // конец return
                };
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
                            "<span class=\"caption\">Дедлайн: </span>"+
                            "<span class=\"dead-date\">"+ projId.date +"</span>"+
                        "</div>"+
                        "<div class=\"tz\">"+
                            "<span class=\"caption\">Техническое задание:</span>"+
                            "<p class=\"tz-text\">"+ projId.tz +"</p>"+
                        "</div>"+
                        "<button class=\"btn-content\" id=\"proj"+ projId.id_proj +"\">Подробнее...</button>"+
                    "</div>";
                };

                // нажатие на создание проекта
                btnNewProj.onclick = function () {
                    // section с организациями
                    var orgListNewProj = document.querySelector("#orgProjNewSection");
                    
                    var nameProjectInput = document.querySelector("#nameProjectNew"); 
                    var tzProjectInput = document.querySelector("#textTzNew"); 
                    var dateProjectInput = document.querySelector("#dateDeadlineNew"); 
                    
                    var btnNewProjOk = document.querySelector("#ok-create-proj");
                    var btnNewProjCancel = document.querySelector("#cancel-create-proj");
                    
                    orgListNewProj.innerHTML = "<option value=\"\" disabled selected hidden>Выберите организацию...</option>";
                    
                    ajax("POST", "http://tableco.ad-best.ru/php/proj/showOrgList.php", false, "login="+user.login+"&password="+user.password, function(response) {
                        if (response == -1 || undefined) {
                            orgListNewProj.innerHTML = "<option value=\"\" disabled selected hidden>У вас нет организаций</option>";
                        } else {
                            var orgListProj = JSON.parse(response);
                            for(var i = 0; i < orgListProj.length; i++){
                                orgListNewProj.innerHTML += "<option value=\""+ orgListProj[i].id_org +"\">"+ orgListProj[i].name_org +"</option>";
                            }
                        }
                    });
                                        
                    mainProjectBlock.style.display = "none";
                    mainProjNew.style.display = "block";
                    
                    btnNewProjOk.onclick = function() {
                        if(nameProjectInput.value != "" & tzProjectInput.value != "" 
                           & dateProjectInput.value != "" & orgListNewProj.value != "") {
                            ajax("POST", "http://tableco.ad-best.ru/php/proj/addProj.php", false, "login="+user.login+"&password="+user.password+"&nameProj="+nameProjectInput.value+"&tzProj="+tzProjectInput.value+"&dateProj="+dateProjectInput.value+"&id_org="+orgListNewProj.value, function(response){
                                projGenerate();
                                mainProjNew.style.display = "none";
                                mainProjectBlock.style.display = "block";
                                nameProjectInput.value = "";
                                tzProjectInput.value = "";
                                dateProjectInput.value = "";
                                orgListNewProj.value = "";
                                showInputsError("Проект успешно добавлен", 2, 1);
                            });
                        } else {
                            showInputsError("Все поля должны быть заполнены", 2, 0);
                        }
                    };
                    
                    btnNewProjCancel.onclick = function () {
                        mainProjNew.style.display = "none";
                        mainProjectBlock.style.display = "block";
                        nameProjectInput.value = "";
                        tzProjectInput.value = "";
                        dateProjectInput.value = "";
                        orgListNewProj.value = "";
                    };
                };
                
                // генерация проектов
                function projGenerate () {
                    //начало ajax получение проектов
                    ajax("POST", "http://tableco.ad-best.ru/php/proj/getProjData.php", false, 
                         "login="+user.login+"&password="+user.password, function(response) {

                        // ответ сервера в формате JSON
                        projectList = JSON.parse(response);
                        //контейнер с проектами
                        var myProj = document.querySelector(".myProj");
                        //контейнер с управлением
                        var myProjControl = document.querySelector(".myProjControl");

                        var caruselHuakin = document.querySelector(".carusel-huakin-proj");

                        myProj.innerHTML = "";
                        myProjControl.innerHTML = "";

                        var pr;
                        if (projectList[0] == undefined) {
                            console.log("Проектов в которых я состою нет");
                        } else {
                            // генерация списка
                            for (var i = 0; i < projectList[0].length; i++) {
                                projItem(myProj, projectList[0][i]);
                            }
                            // присваивания события кнопкам
                            for (var i = 0; i < projectList[0].length; i++) {
                                pr = projectList[0][i];
                                document.querySelector("#proj" + pr.id_proj).onclick = projMore(pr.id_proj, pr);
                            }
                        }

                        if (projectList[1] == undefined) {
                            console.log("Моих Проектовнет");
                        } else {
                            for (var i = 0; i < projectList[1].length; i++) {
                                projItem(myProjControl, projectList[1][i]);
                            }
                            for (var i = 0; i < projectList[1].length; i++) {
                                pr = projectList[1][i];
                                document.querySelector("#proj" + pr.id_proj).onclick = projMore(pr.id_proj, pr);
                            }
                        }
                        caruselHuakin.style.width = (400 * ((projectList[0] == undefined ? 1 : projectList[0].length) + (projectList[1] == undefined ? 1 : projectList[1].length))) + "px";
                    });
                    //конец ajax получение проектов
                };
                projGenerate();
                //      КОНЕЦ ДЕЙСТВИЙ С ПРОЕКТАМИ     //
                ////////////////////////////////////////
                
                  /////////////////////////////////
                 //   ДЕЙСТВИЯ С ОРГАНИЗАЦИЯМИ  //
                // отображение списка работников
                function moreOrg (idOrg, orgListM) {
                    return function () {
                        var 
                            workOrgName = document.querySelector("#workNameOrg"),
                            workOrgNameMemb = document.querySelector("#workNameMemb"),
                            // блок ul со списком работников
                            workMemberList = document.querySelector(".member-list"),
                            // блок Приглашение в организацию 
                            workerInviteOrg = document.querySelector(".modal-invite-org"),
                            // блок Приглашение в проект 
                            workerInviteProj = document.querySelector(".modal-invite-proj"),
                            // блок подробнее о работнике
                            workerMoreBlock = document.querySelector(".modal-more-worker"),
                            // кнопка для открытия блока приглашения в организацию
                            btnInviteOrg = document.querySelector(".modal-intoteam-btn");

                        //список с работниками
                        var workerList;
                        
                        function workerItem (container, workerListI) {
                            container.innerHTML += "<li class=\"member-list-item clearfix\">"+
                                "<div class=\"left\">"+
                                    "<div class=\"member-avatar-block\">"+
                                        "<img src=\""+ (workerListI.img == 0? "../../IMG/avatar.svg":workerListI.img) +
                                            "\" alt=\"\" class=\"member-avatar-img\">"+
                                    "</div>"+
                                    "<div class=\"member-name-block\">"+
                                        "<div class=\"member-name\">"+ workerListI.fname +" "+ workerListI.name +"</div>"+
                                        "<div class=\"member-sub-name\">"+ workerListI.proj +"</div>"+      
                                    "</div>"+
                                "</div>"+
                                "<div class=\"right\">"+
                                    "<button class=\"send-mess-btn\" id=\"worker"+ workerListI.id_user +"\"></button>"+
                                    "<button class=\"member-more-btn\" id=\"workerMore"+workerListI.id_user+"\">Подробнее...</button>"+
                                "</div>"+
                            "</li>";
                        };

                        workOrgName.innerHTML = orgListM.name;
                        workOrgNameMemb.innerHTML = orgListM.mngr;

                        // окно добавления в проект
                        function addWorkerInProj(idWorker) {
                            return function () {
                                var projNameSection = document.querySelector("#projectNameIP");
                                var btnInProjOk = document.querySelector("#ok-invite-proj");
                                var btnInProjCancel = document.querySelector("#cancel-invite-proj");
                                
                                projNameSection.innerHTML = "<option value=\"\"  disabled selected hidden>Проект</option>";

                                ajax("POST", "http://tableco.ad-best.ru/php/org/showProjList.php", false,
                                    "login=" + user.login + "&password=" + user.password + "&id_org=" + idOrg,
                                    function (response) {
                                        var projNameList = JSON.parse(response);
                                        for (var i = 0; i < projNameList.length; i++) {
                                            projNameSection.innerHTML += "<option " +
                                            "value=\"" + projNameList[i].id_proj + "\">" + projNameList[i].name_proj + "</option>";
                                        }
                                    });
                                workerInviteProj.style.display = "block";
                                mainModalBlock.style.display = "block";
                                
                                btnInProjOk.onclick = function () {
                                    if (projNameSection.value !== "") {
                                        ajax("POST", "http://tableco.ad-best.ru/php/proj/addWorker.php", false,
                                            "login=" + user.login + "&password=" + user.password + "&id_org=" + idOrg + "&id_proj=" + projNameSection.value + "&id_user=" + idWorker,
                                            function (response) {
                                                workerInviteProj.style.display = "none";
                                                mainModalBlock.style.display = "none";
                                                projNameSection.value = "";
                                                showInputsError("Работник успешно добавлен в проект", 3, 1);
                                            });
                                    } else {
                                        showInputsError("Выберите проект", 2);
                                    }
                                };

                                btnInProjCancel.onclick = function () {
                                    workerInviteProj.style.display = "none";
                                    mainModalBlock.style.display = "none";
                                    projNameSection.value = "";
                                };
                            } // конец return
                        };

                        // окно подробнее о работнике
                        function workerMore(i) {
                            return function() {
                                document.querySelector(".worker-modal-title").innerHTML = (workerList[i].fname+" "+workerList[i].name);
                                document.querySelector(".worker-modal-subtitle").innerHTML = workerList[i].otchestvo;
                                document.querySelector(".worker-avatar-img").src = (workerList[i].img == 0? "../IMG/avatar.svg":workerList[i].img);
                                document.querySelector("#worker-phone").value = workerList[i].phone;
                                document.querySelector("#worker-email").value = workerList[i].mail;
                                document.querySelector("#worker-aboutUs").value = workerList[i].about;

                                workerMoreBlock.style.display = "block";
                                mainModalBlock.style.display = "block";

                                document.querySelector("#workerMoreClose").onclick = function() {
                                    workerMoreBlock.style.display = "none";
                                    mainModalBlock.style.display = "none";
                                };
                            } // конец return

                        };
                        
                        workMemberList.innerHTML = "";

                        // получение списка сотрудников
                        function workerListGenerate () {
                            ajax("POST", "http://tableco.ad-best.ru/php/org/showWorkers.php", false, 
                             "login="+user.login+"&password="+user.password+"&id_org="+idOrg, function(response) {
                            //var workerList 
                                workerList = JSON.parse(response);
                                workMemberList.innerHTML = "";
                                for(var i = 0; i < workerList.length; i++){
                                    workerItem(workMemberList, workerList[i]);
                                }
                                for(var i = 0; i < workerList.length; i++){
                                    document.querySelector("#worker"+workerList[i].id_user).onclick = addWorkerInProj(workerList[i].id_user);
                                    document.querySelector("#workerMore"+workerList[i].id_user).onclick = workerMore(i);
                                }
                            });
                        };
                        workerListGenerate();

                        modal.style.display = "block";
                        workerListBlock.style.display = "block";

                        // окно добавление в организацию
                        btnInviteOrg.onclick = function () {
                            var dataLUIO = document.querySelector("#dataLUIO");
                            var btnInOrgOk = document.querySelector("#ok-invite-org");
                            var btnInOrgCancel = document.querySelector("#cancel-invite-org");
                            var loginInOrgInput = document.querySelector("#loginUserIO");
                            ajax("POST", "http://tableco.ad-best.ru/php/org/showUsers.php", false,
                                "login="+user.login+"&password="+user.password, function(response) {
                                var userList = JSON.parse(response);
                                dataLUIO.innerHTML = "";
                                for(var i=0; i<userList.length; i++) {
                                    dataLUIO.innerHTML += "<option value=\""+ userList[i].login +"\"></option>";
                                }
                            });
                            workerInviteOrg.style.display = "block";
                            mainModalBlock.style.display = "block";

                            btnInOrgCancel.onclick = function() {
                                workerInviteOrg.style.display = "none";
                                mainModalBlock.style.display = "none";
                                loginInOrgInput.value = "";
                            };

                            btnInOrgOk.onclick = function() {
                                if(loginInOrgInput.value !== ""){
                                    ajax("POST", "http://tableco.ad-best.ru/php/org/addWorker.php", false,
                                    "login="+user.login+"&password="+user.password+"&id_org="+idOrg+"&loginUser="+loginInOrgInput.value, function(response){
                                        if(response == 1) {
                                            workerListGenerate();
                                            workerInviteOrg.style.display = "none";
                                            mainModalBlock.style.display = "none";
                                            loginInOrgInput.value = "";
                                        } else {
                                            showInputsError("Ошибка добавления", 2);
                                        }
                                    });
                                } else {
                                    showInputsError("Заполните поле", 2);
                                }
                            };
                        };

                        // кнопка закрыть в списке работников
                        workerListClose.onclick = function() {
                            orgGenerate();
                            modal.style.display = "none";
                            workerListBlock.style.display = "none";
                        }; 
                    } // конец return
                };// конец отображение списка работников
                // создание элемента списка организаций
                function orgItem (container, orgList) {
                    var projHtml = "";
                    var workHtml = "";
                    ajax("POST", "http://tableco.ad-best.ru/php/org/showProjList.php", false,
                    "login=" + user.login + "&password=" + user.password + "&id_org=" + orgList.id_org,
                    function (response) {
                        if(response == -1) {
                            projHtml += "<li>Проектов нет</li>";
                        } else {
                            var projNameList = JSON.parse(response);
                            for (var i = 0; i < 3; i++) {
                                if(projNameList[i] !=undefined){
                                projHtml += "<li>"+ projNameList[i].name_proj +"</li>";
                                } else {
                                    //projHtml += "<li></li>";
                                    break;
                                }
                            }
                        }
                    });
                    ajax("POST", "http://tableco.ad-best.ru/php/org/showWorkers.php", false, 
                             "login="+user.login+"&password="+user.password+"&id_org="+orgList.id_org, function(response) {
                        var workerNameList = JSON.parse(response);
                        for(var i = 0; i < 3; i++){                            
                            if(workerNameList[i] !=undefined) {
                                workHtml += "<li>"+ workerNameList[i].fname +" "+ workerNameList[i].name +"</li>";
                            } else {
                                //workHtml += "<li></li>";
                                break;
                            }
                        }
                    });
                    container.innerHTML +=
                    "<div class=\"block-content\">"+
                        "<div class=\"title-block\">"+
                            "<span class=\"caption\">"+ orgList.name +"</span><br>"+
                            "<img class=\"groupOut-btn\" src=\"../IMG/GroupOut.svg\">"+
                            "<div class=\"context-btn orgSetBlock\">"+
                                "<div class=\"context-content orgSet-btn\" id=\"orgDel"+ orgList.id_org +"\">Удалить организацию...</div>"+
                            "</div>"+
                        "</div>"+
                        "<hr>"+
                        "<div class=\"manager\">"+
                            "Создатель организации: <span class=\"manager-name\">"+ orgList.mngr +"</span>"+
                        "</div>"+
                        "<div class=\"myProject\">"+
                            "<div class=\"caption\">Проекты:</div>"+
                            "<ul>"+ projHtml +"</ul>"+
                        "</div>"+
                        "<div class=\"top-developer\">"+
                            "<span class=\"caption-ul\">Разработчики:</span>"+
                            "<ul>"+ workHtml +"</ul>"+
                        "</div>"+
                        "<button class=\"btn-content\" id=\"org"+ orgList.id_org +"\">Список работников</button>"+
                    "</div>";
                };
                // удаление организаций
                function orgDel (idOrgDel) {
                    return function () {
                        var modalQuestion = document.querySelector(".modal-question-form");
                        var btnQuestionYes = document.querySelector(".yes-btn");
                        var btnQuestionNo = document.querySelector(".no-btn");
                        mainModalBlock.style.display = "block";
                        modalQuestion.style.display = "block";

                        btnQuestionYes.onclick = function () {
                            ajax("POST", "#", false, "login="+user.login+"&password="+user.password+"&id_org="+idOrgDel, function(response){
                                orgGenerate();
                                generateTask();
                                projGenerate();
                                mainModalBlock.style.display = "none";
                                modalQuestion.style.display = "none";
                            });
                        };

                        btnQuestionNo.onclick = function () {
                            mainModalBlock.style.display = "none";
                            modalQuestion.style.display = "none";  
                        };
                    } // конец return
                };
                
                // генерация списка организаций
                function orgGenerate () {
                    //начало ajax получение организаций
                    ajax("POST", "http://tableco.ad-best.ru/php/org/getOrgData.php", false, 
                         "login="+user.login+"&password="+user.password, function(response) {
                        console.log(response);
                        
                        // ответ сервера в формате JSON
                        organizationList = JSON.parse(response);
                        
                        

                        //контейнер с проектами
                        var myOrg = document.querySelector(".myOrg");
                        //контейнер с управлением
                        var myOrgControl = document.querySelector(".myOrgControl");
                        // контейнер для карусели
                        var caruselHuakinOrg = document.querySelector(".carusel-huakin-org");
                        
                        myOrg.innerHTML = "";
                        myOrgControl.innerHTML = "";
                        
                        var org;
                        if (organizationList[0] == undefined) {
                            console.log("Организаций в которых я состою нет");
                        } else {
                            for (var i = 0; i < organizationList[0].length; i++) {
                                orgItem(myOrg, organizationList[0][i]);
                            }
                            for (var i = 0; i < organizationList[0].length; i++) {
                                org = organizationList[0][i];
                                document.querySelector("#org" + org.id_org).onclick = moreOrg(org.id_org, org);
                            }
                        }
                        
                        if (organizationList[1] == undefined) {
                            console.log("Организаций в которых я состою нет");
                        } else {
                            for (var i = 0; i < organizationList[1].length; i++) {
                                orgItem(myOrgControl, organizationList[1][i]);
                            }
                            for (var i = 0; i < organizationList[1].length; i++) {
                                org = organizationList[1][i];
                                document.querySelector("#org" + org.id_org).onclick = moreOrg(org.id_org, org);
                                document.querySelector("#orgDel" + org.id_org).onclick = orgDel(org.id_org);
                            }
                        }
                        
                        caruselHuakinOrg.style.width = (400 * ((organizationList[0]==undefined?1:organizationList[0].length) + (organizationList[1]==undefined?1:organizationList[1].length))) + "px";
                    }); //конец ajax получение организаций
                };
                orgGenerate();
                
                // создание новой организации
                btnNewOrg.onclick = function () {
                    modalNewOrg.style.display = "block";
                    mainModalBlock.style.display = "block";
                    var nameNewOrg = document.querySelector("#nameNewOrg");
                    document.querySelector("#createNewOrg").onclick = function () {
                        if(nameNewOrg.value !== "") {
                            ajax("POST", "http://tableco.ad-best.ru/php/org/addOrg.php", false,
                            "login="+user.login+"&password="+user.password+"&name="+nameNewOrg.value, function(response){
                                orgGenerate();
                                modalNewOrg.style.display = "none";
                                mainModalBlock.style.display = "none";
                            });
                        } else {
                            showInputsError("Поле не должно быть пустое", 2);
                        }
                    }
                    document.querySelector("#cancelNewOrg").onclick = function () {
                        nameNewOrg.nodeValue = "";
                        modalNewOrg.style.display = "none";
                        mainModalBlock.style.display = "none";
                    };
                };
                //   КОНЕЦ ДЕЙСТВИЙ С ОРГАНИЗАЦИЯМИ    //
                ////////////////////////////////////////
                
                /////////////////////////////////
                //   ДЕЙСТВИЯ С ЗАДАЧАМИ      //
                // нажатие на checkbox задачи
                function checkTask (idTask) {
                    return function() {
                        ajax("POST", "http://tableco.ad-best.ru/php/tasks/checkTask.php", false, "login="+user.login+"&password="+user.password+"&id_task="+idTask, function(response){
                        // что должно происходить кроме отправки ajax??
                        });
                    }
                }
                // создание элемента списка задач
                function taskItem (container, taskList) {
                    var colorStatus;
                    switch (Number(taskList.imp)) {
                        case 0:
                            colorStatus = "#C4CAD8";
                            break;
                        case 1:
                            colorStatus = "#299EFF";
                            break;
                        case 2:
                            colorStatus = "#FFB550";
                            break;
                        case 3:
                            colorStatus = "#F24040";
                            break;
                        default:
                            colorStatus = "#F7F8FA";
                    }
                    container.innerHTML += "<li class=\"item-task\">"+
                        "<div class=\"task-block\">"+
                            "<div class=\"status\" style=\"background: "+ colorStatus +"\"></div>"+
                            "<input type=\"checkbox\" class=\"check-task\" id=\"task"+ taskList.id_task +
                                "\""+(taskList.complete==0?"":" checked")+">"+
                            "<label for=\"task"+ taskList.id_task +"\"><span class=\"task-text\">"+ taskList.text +"</span></label>"+
                            "<div class=\"tasks-right-block right\">"+
                                "<span class=\"project-text\">"+ taskList.proj +"</span>"+
                                "<span class=\"task-date\">"+ taskList.date +"</span>"+
                            "</div>"+
                        "</div>"+
                    "</li>";
                    //document.querySelector("#task"+taskList.id_task).onclick = checkTask(taskList.id_task);
                };
                // генерация списка задач
                function generateTask () {
                    ajax("POST", "http://tableco.ad-best.ru/php/tasks/getTasks.php", false, 
                         "login="+user.login+"&password="+user.password, function(response) {
                        tasksList = JSON.parse(response);
                        
                        // контейнеры для задач
                        var myTaskContainer = document.querySelector("#mainMyTaskContainer");
                        var controlTaskContainer = document.querySelector("#mainControlTaskContainer");
                        
                        myTaskContainer.innerHTML = "";
                        controlTaskContainer.innerHTML = "";
                        
                        var task;
                        if (tasksList.tocheck == undefined) {
                            console.log("Задач которые вы дали нет");
                        } else {
                            for (var i = 0; i < tasksList.tocheck.length; i++) {
                                taskItem(controlTaskContainer, tasksList.tocheck[i]);
                            }
                            for (var i = 0; i < tasksList.tocheck.length; i++) {
                                task = tasksList.tocheck[i];
                                document.querySelector("#task" + task.id_task).oncheck = checkTask(task.id_task);
                            }
                        }

                        if (tasksList.todo == undefined) {
                            console.log("Задач которые вам дали нет");
                        } else {
                            for (var i = 0; i < tasksList.todo.length; i++) {
                                taskItem(myTaskContainer, tasksList.todo[i]);
                            }
                            for (var i = 0; i < tasksList.todo.length; i++) {
                                task = tasksList.todo[i];
                                document.querySelector("#task" + task.id_task).oncheck = checkTask(task.id_task);
                            }
                        }
                    });
                };
                generateTask();
                //   КОНЕЦ ДЕЙСТВИЙ С ЗАДАЧАМИ  //
                //////////////////////////////////
                
                // СКРЫТИЕ ОКНА ЗАГРУЗКИ
                loadingBlock.style.display = "none";

                /////////////////////////////
                //ОТКРЫТИЕ БОКОВЫХ ВКЛАДОК//
                // вкладка задачи
                btnTask.onclick = function () {
                    mainOrganizationBlock.style.display = "none";
                    mainProjectBlock.style.display = "none";
                    mainTaskBlock.style.display = "block";
                    btnProject.classList.remove("active");
                    btnTask.classList.add("active");
                    btnOrganization.classList.remove("active");
                    mainProjMore.style.display = "none";
                    mainProjNew.style.display = "none";
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
                    mainProjNew.style.display = "none";
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
                    mainProjNew.style.display = "none";
                }
                //      КОНЕЦ ВКЛАДОК     //
                ////////////////////////////

                //Кнопка аватара
                btnProfile.onclick = function openProfile() {
                    var aboutUserForm = document.querySelector(".aboutUserForm");
                    mainModalBlock.style.display = "block";
                    aboutUserForm.style.display = "block";
                    
                    document.querySelector("#aboutUserClose").onclick = function () {
                        mainModalBlock.style.display = "none";
                        aboutUserForm.style.display = "none";
                    };
                    
                    document.querySelector("#logOutBtn").onclick = function () {
                        localStorage.clear();
                        loginHtml();
                    };
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