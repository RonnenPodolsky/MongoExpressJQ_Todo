$(document).ready(async () => {
    const todos = await $.getJSON('/todos/api');
    showTodosFromDB(todos)


    $('.todo-list').on('click', '.text', function() {
        updateTodoCompletion($(this));
    })

    $('.todo-list').on('click', '.edit', function() {
        editTodoText($(this).parent());
    })

    $('.todo-list').on('click', '.delete', function() {
        removeTodo($(this).parent());
    })

    $('.input-form').on('submit', e => {
        e.preventDefault();

        if ($('.input-field').val()) { createTodo(); }
        else { alert('please insert text'); }

        $('.input-field').focus();
    })

    $('.search-input').on('keyup', function(e) {
        searchTodos($(this));
    })

})

const showTodosFromDB = todos => {
    for (let item of todos){
        showTodo(item)
    }
    $('.input-field').focus();
}

const showTodo = todo => {
    let elem = $(`<li><span class="text ${ todo.isCompleted ? 'completed' : 'notcompleted'}">${todo.text}</span><span class="edit">edit</span><span class="delete"> x</span></li>`)
    $('.todo-list').prepend(elem);
    elem.data('id', todo._id)
    elem.data('isCompleted', todo.isCompleted)
}

const updateTodoCompletion = async elem => {
    const endpoint = `/todos/api/${elem.parent().data('id')}`;
    const updateTodo = await fetch(endpoint, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(
            { isCompleted: !elem.parent().data('isCompleted')}
        )
    })
    .then(response => {
        elem.toggleClass('completed')
    })
    .catch(error => console.log(error))
}

const editTodoText = async elem => {
    let newText = prompt("change to: ");
    
    if (newText === null) {return}
    if (newText === '') {return}

    const endpoint = `/todos/api/${elem.data('id')}`;
    const updateTodo = await fetch(endpoint, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(
            {text: newText}
        )
    })
    .then(response => {
        elem.children('.text').text(newText)
    })
    .catch(error => console.log(error))
}

const removeTodo = async elem => {
    const endpoint = `/todos/api/${elem.data('id')}`;
    const deletedTodo = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json'
        }
    })
    .then(response => {
        elem.remove();
    })
    .catch(error => console.log(error))
}

const createTodo = async () => {
    const userInput = $('.input-field').val();
    const endpoint = '/todos/api/';

    const createdTodo = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(
            { text: userInput }
        )
    })
    const responseText = await createdTodo.json();
    $('.input-field').val('')
    $('.input-field').focus()
    showTodo(responseText)
}

const searchTodos = async elem => {
    searchedTerm = elem.val().toLowerCase();

    const todos = await $.getJSON('/todos/api');
    const filtered = todos.filter(element => {
         return element.text.toLowerCase().includes(searchedTerm) // empty string "" always returns true so when deleting the term keeps all items from the original todos array
    })

    $('.todo-list').text('')
    showTodosFromDB(filtered)
    $('.search-input').focus()
}