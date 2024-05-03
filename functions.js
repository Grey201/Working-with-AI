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


module.exports = {addTodoItem, clearTodoItems, readTodos};
