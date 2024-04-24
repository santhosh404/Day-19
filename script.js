const createTodoBtn = document.getElementById('createTodoBtn');
const todoName = document.getElementById('todoName');
const deadLine = document.getElementById('deadLine');
const description = document.getElementById('description');
const submitButton = document.getElementById('submitButton')
const form = document.getElementById('form');
const todosContainer = document.getElementById('todosContainer');

let actionType = 'create';
let todoId;

const validForm = () => {

    let todoValid = false;
    let deadLineValid = false;
    let descriptionValid = false;



    if (!todoName.value) {
        todoName.classList.add('is-invalid');
    } else {
        todoName.classList.remove('is-invalid');
        todoValid = true;
    }

    if (!deadLine.value) {
        deadLine.classList.add('is-invalid');
    } else {
        deadLine.classList.remove('is-invalid');
        deadLineValid = true;
    }

    if (!description.value) {
        description.classList.add('is-invalid');
    } else {
        description.classList.remove('is-invalid');
        descriptionValid = true;
    }

    todoName.addEventListener('input', () => {
        todoName.classList.remove('is-invalid');
        todoValid = true;
    })

    deadLine.addEventListener('input', () => {
        deadLine.classList.remove('is-invalid');
        todoValid = true;
    })

    description.addEventListener('input', () => {
        description.classList.remove('is-invalid');
        todoValid = true;
    })

    if (todoValid && deadLineValid && descriptionValid) {
        return true;
    }
    else {
        return false;
    }
}

const generateUniqueId = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
}

document.addEventListener('DOMContentLoaded', () => {
    getTodos();
})

createTodoBtn.addEventListener('click', () => {
    submitButton.removeAttribute('data-bs-dismiss');
    actionType = 'create';
})


form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validForm()) {

        if (actionType === 'create') {
            createTodoHandler();
        }

        else if (actionType === 'edit') {
            let todos = JSON.parse(localStorage.getItem('guvi_todo_data')) || [];
            const index = todos.findIndex(todo => todo.id === todoId);

            if (index !== -1) {
                todos[index] = {
                    id: todoId,
                    todoName: todoName.value,
                    deadLine: deadLine.value,
                    description: description.value
                };

                localStorage.setItem('guvi_todo_data', JSON.stringify(todos));
            }

        }

        //closing the modal
        submitButton.setAttribute('data-bs-dismiss', 'modal');
        submitButton.click();

        //Reseting the form
        resetForm();

        //Getting the todos
        getTodos();
    };
});

const createTodoHandler = () => {
    let todo = JSON.parse(localStorage.getItem('guvi_todo_data')) || [];

    const newTodo = {
        id: generateUniqueId(),
        todoName: todoName.value,
        deadLine: deadLine.value,
        description: description.value
    }
    todo = [...todo, newTodo];
    localStorage.setItem("guvi_todo_data", JSON.stringify(todo));
}

const resetForm = () => {
    todoName.value = "";
    deadLine.value = "";
    description.value = "";
    todoName.classList.remove('is-invalid');
    deadLine.classList.remove('is-invalid');
    description.classList.remove('is-invalid');
}

const getTodos = () => {
    // Clear existing todos from the UI
    todosContainer.innerHTML = '';

    const todos = JSON.parse(localStorage.getItem('guvi_todo_data')) || [];
    if (todos.length === 0) {
        const div = document.createElement('div');
        div.classList.add('d-flex', 'justify-content-center', 'fw-bold');
        div.innerHTML = "No Records Exists";
        todosContainer.appendChild(div)
    }
    else {
        todos.forEach((t) => {

            const col = document.createElement('div');
            col.classList.add('col-lg-3', 'col-md-4', 'col-sm-6');
            const card = document.createElement('div');
            card.classList.add('card', 'mb-3');

            // Construct inner HTML for the card
            card.innerHTML = `
                <div class="card-header d-flex justify-content-center gap-3">
                    <h3 class="text-center fw-bolder m-0" id="todoTitle">${t.todoName}</h3>
                </div>
                <div class="card-body">
                    <p class="card-text d-flex flex-column gap-3" id="todoDescription">
                        <span style="text-align: justify;">${t.description}</span>
                        <small id="todoDeadLine" class="fw-bold">Deadline: <span class="fw-normal">${t.deadLine}</span></small>
                    </p>
                </div>
                <div class="card-footer p-3">
                    <div class="d-flex justify-content-center gap-2 align-items-center">
                        <button class="btn btn-outline-secondary btn-sm edit-btn" data-bs-toggle="modal" data-bs-target="#createTodoModal">Edit</button>
                        <button class="btn btn-outline-danger btn-sm delete-btn">Delete</button>
                    </div>
                </div>
            `;

            const editButton = card.querySelector('.edit-btn');
            editButton.addEventListener('click', () => editTodoHandler(t));

            const deleteButton = card.querySelector('.delete-btn');
            deleteButton.addEventListener('click', () => deleteTodoHandler(t));

            col.appendChild(card);
            todosContainer.appendChild(col);
        });
    }


}


const deleteTodoHandler = (t) => {
    let todos = JSON.parse(localStorage.getItem('guvi_todo_data'));
    const index = todos.findIndex(todo => todo.todoName === t.todoName && todo.deadLine === t.deadLine && todo.description === t.description);
    todos.splice(index, 1);
    localStorage.setItem('guvi_todo_data', JSON.stringify(todos));

    getTodos();
}

const editTodoHandler = (t) => {
    console.log(t)
    todoName.value = t.todoName;
    deadLine.value = t.deadLine;
    description.value = t.description;
    actionType = 'edit';
    submitButton.innerText = 'Update';
    todoId = t.id
}

