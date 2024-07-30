const fs = require('fs');

function readTodos() {
    let todos = [];
    const data = fs.readFileSync('./storage.json', 'utf8');
    const jsonData = JSON.parse(data);
    todos.push(...jsonData);
    return todos;
}

/**
 * Clears the todo items by overwriting the contents of the storage.json file with an empty array.
 * @function clearTodoItems
 * @returns {void}
 */
function clearTodoItems() {
    // fs.writeFile('./storage.json', '[]', 'utf8', (err) => {
    //     if (err) {
    //         return;
    //     }
    //     console.log('Data cleared from storage.json');
    // });
}

function addTodoItem(todo) {
    let todos = [];
    fs.readFile('./storage.json', 'utf8', (err, data) => {
        if (err) {
            return;
        }
        const jsonData = JSON.parse(data);
        todos.push(...jsonData);
        todos.push(todo);
        fs.writeFile('./storage.json', JSON.stringify(todos), 'utf8', (err) => {
            if (err) {
                return;
            }
            console.log('Data saved to storage.json');
        });
    });
}

function deleteTodoItem(todoId) {
    fetch(`/todos/${todoId}`, {
        method: 'DELETE'
    })
    .then(() => {
        renderTodoItems();
    })
    .catch(error => {
        console.error(error);
    });
}


function renderTodoItems() {
    fetch('/todos')
        .then(response => response.json())
        .then(todos => {
            const todoList = document.getElementById('todoList');
            todoList.innerHTML = '';
            todos.sort((a, b) => {
                if (a.completed && !b.completed) {
                    return 1; // Sort completed todos after uncompleted todos
                } else if (!a.completed && b.completed) {
                    return -1; // Sort uncompleted todos before completed todos
                } else {
                    return 0; // Maintain the original order if both todos are completed or uncompleted
                }
            });
            todos.forEach(todo => {
                const todoItem = document.createElement('div');
                todoItem.className = 'todo-item';
                const titleDiv = document.createElement('div');
                titleDiv.textContent = todo.title;
                if (todo.completed) {
                    titleDiv.style.textDecoration = 'line-through'; // Apply line-through style if the todo is completed
                }
                todoItem.appendChild(titleDiv); // Wrap the title in a div element
                
                const completeButton = document.createElement('button');
                completeButton.className = 'complete-button';
                completeButton.textContent = 'Complete';
                completeButton.addEventListener('click', () => markTodoCompleted(todo.id));
                todoItem.appendChild(completeButton);

                const incompleteButton = document.createElement('button');
                incompleteButton.className = 'incomplete-button';
                incompleteButton.textContent = 'Incomplete';
                incompleteButton.addEventListener('click', () => markTodoIncomplete(todo.id));
                todoItem.appendChild(incompleteButton);
                
                if (todo.completed) {
                    completeButton.style.display = 'none'; // Hide the complete button if the todo is already completed
                } else {
                    incompleteButton.style.display = 'none'; // Hide the incomplete button if the todo is not completed
                }
                
                todoList.appendChild(todoItem);

                const deleteButton = document.createElement('button');
                deleteButton.className = 'delete-button';
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => deleteTodoItem(todo.id));
                todoItem.appendChild(deleteButton);
                
                const splitter = document.createElement('hr');
                todoList.appendChild(splitter); // Add a horizontal line as a splitter between todo items
            });
        })
        .catch(error => {
            console.error(error);
        });
}

module.exports = {addTodoItem, clearTodoItems, readTodos, deleteTodoItem, renderTodoItems};
