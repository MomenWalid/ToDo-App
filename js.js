let input = document.querySelector(".add-task input");
let addButton = document.querySelector(".add-task .plus");

let taskContainer = document.querySelector(".tasks-content");

let tasks = document.querySelectorAll(".tasks-content .task-box");

let taskCount = document.querySelector(".task-count span");

let taskCompleted = document.querySelector(".task-completed span");

window.onload = function() {
    input.focus();

    if (taskContainer.childElementCount == 0) {
        noTask();
    }

    calcTasks();
};

let arrayOfTasks = [];

if (localStorage.getItem("task")) {
    arrayOfTasks = JSON.parse(localStorage.getItem("task"));
}

getLocalStorageTask();

document.onkeyup = function(e) {
    if (e.key === "Enter") {
        addButton.onclick();
    }
};

addButton.onclick = function() {
    if (input.value == "") {
        swal.fire("Please Add any Task");
    } else {
        let noTaskMesaage = document.querySelector(".no-tasks-message");

        if (document.body.contains(document.querySelector(".no-tasks-message"))) {
            noTaskMesaage.remove();
        }

        addTasks(input.value);

        input.value = "";

        input.focus();

        calcTasks();
    }
};

function noTask() {
    let msgSpan = document.createElement("span");

    let textMsg = document.createTextNode("No Task To Show");

    msgSpan.appendChild(textMsg);

    msgSpan.className = "no-tasks-message";

    taskContainer.appendChild(msgSpan);
}

function calcTasks() {
    taskCount.innerHTML = document.querySelectorAll(
        ".tasks-content .task-box"
    ).length;

    taskCompleted.innerHTML = document.querySelectorAll(
        ".tasks-content .finished"
    ).length;
}

document.addEventListener("click", (e) => {
    if (e.target.className === "delete") {
        deleteTaskForLS(e.target.parentNode.getAttribute("data-id"));

        e.target.parentNode.remove();
        if (taskContainer.childElementCount == 0) {
            noTask();
        }
    }

    if (e.target.classList.contains("task-box")) {
        completeTaskForLS(e.target.getAttribute("data-id"));

        e.target.classList.toggle("finished");
    }

    calcTasks();
});

function addTasks(taskText) {
    const task = {
        id: new Date().getTime(),
        title: taskText,
        completed: false,
    };
    arrayOfTasks.push(task);

    addTasksToPage(arrayOfTasks);

    localStorageTask(arrayOfTasks);
}

function addTasksToPage(arrayOfTasks) {
    taskContainer.innerHTML = "";

    arrayOfTasks.forEach((task) => {
        checkTaskWriteenBefore();

        let div = document.createElement("div");
        div.className = "task-box";

        if (task.completed) {
            div.classList.add("finished");
        }

        div.setAttribute("data-id", task.id);

        div.appendChild(document.createTextNode(task.title));

        let span = document.createElement("span");
        span.className = "delete";
        span.appendChild(document.createTextNode("Delete"));

        div.appendChild(span);

        taskContainer.appendChild(div);

        deleteAll(div);

        completeAll(div);
    });
}

function deleteAll(task) {
    document.addEventListener("click", (e) => {
        if (e.target.className === "delete-button") {
            localStorage.removeItem("task");
            task.remove();

            if (taskContainer.childElementCount == 0) {
                noTask();
            }
            calcTasks();
            input.focus();
            location.reload();
        }
    });
}

function completeAll(task) {
    document.addEventListener("click", (e) => {
        if (e.target.className === "complete-button") {
            completeAllTasks();

            task.classList.add("finished");

            calcTasks();
        }
    });
}

function localStorageTask(task) {
    localStorage.setItem("task", JSON.stringify(task));
}

function getLocalStorageTask() {
    let task = localStorage.getItem("task");

    if (task) {
        let tasks = JSON.parse(task);

        addTasksToPage(tasks);
    }
}

function deleteTaskForLS(e) {
    arrayOfTasks = arrayOfTasks.filter((task) => task.id != e);
    localStorageTask(arrayOfTasks);
}

function completeTaskForLS(e) {
    for (let i = 0; i < arrayOfTasks.length; i++) {
        if (arrayOfTasks[i].id == e) {
            arrayOfTasks[i].completed == false ?
                (arrayOfTasks[i].completed = true) :
                (arrayOfTasks[i].completed = false);
        }
    }
    localStorageTask(arrayOfTasks);
}

function completeAllTasks() {
    for (let i = 0; i < arrayOfTasks.length; i++) {
        arrayOfTasks[i].completed = true;
    }
    localStorageTask(arrayOfTasks);
}

function checkTaskWriteenBefore() {
    let divClass = document.querySelectorAll(".tasks-content .task-box");

    divClass.forEach((e) => {
        if (e.childNodes[0].data === input.value) {
            swal.fire("You Write This Task Before");
        }
    });
}