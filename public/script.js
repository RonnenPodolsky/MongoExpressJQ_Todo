$(document).ready(async () => {
    const todos = await $.getJSON('/todos/api'); // array of objects from the DB
    // same as:
    // const todos = await fetch('/todos/api', {
    //     method: 'GET',
    //     headers: {
    //         'Content-type': 'application/json'
    //     }
    // })
    // const todos_array = await todos.json();
    showTodosFromDB(todos)

    $('.todo-list').on('click', '.text', function() {
        updateTodoCompletion($(this).parent());
    })

    $('.todo-list').on('click', '.edit', function() {
        editTodoText($(this).parent());
    })

    $('.todo-list').on('click', '.delete', function() {
        removeTodo($(this).parent());
    })

    $('.search-input').on('keyup', function(e) {
        searchTodos($(this));
    })

    $('.input-form').on('submit', e => {
        e.preventDefault();

        if (!$('.input-field').val()) { // inserted todo is empty
            alert('please do insert text');
            $('.input-field').focus();
            return;
        }

        createTodo(); 
        $('.input-field').focus();
    })
})

const showTodosFromDB = todos => {
    for (let item of todos){
        showSingleTodo(item)
    }
    $('.input-field').focus();
}

const showSingleTodo = todo => {
    let elem = $(`<li>
                        <span class="text ${ todo.isCompleted ? 'completed' : ''}">${todo.text}</span>
                        <span class="edit">edit</span>
                        <span class="delete">x</span>
                  </li>`)
    $('.todo-list').prepend(elem);
    elem.data('id', todo._id);
    elem.data('isCompleted', todo.isCompleted);
}

const updateTodoCompletion = async elem => {
    const endpoint = `/todos/api/${elem.data('id')}`;
    const updateTodo = await fetch(endpoint, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(
            { isCompleted: !elem.data('isCompleted')}
        )
    })
    .then(response => {
        elem.children('.text').toggleClass('completed')
        elem.data('isCompleted', !elem.data('isCompleted'));
    })
    .catch(error => console.log(error))
}

const editTodoText = async elem => {
    let newText = prompt("change to: ");
    if (!newText.trim()) {return}

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
    .then(response => elem.children('.text').text(newText))
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
    .then(response => elem.remove())
    .catch(error => console.log(error))
}

const createTodo = async () => {
    const userInput = $('.input-field').val();

    const createdTodo = await fetch('/todos/api/', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(
            { text: userInput }
        )
    })
    const responseText = await createdTodo.json();
    showSingleTodo(responseText);

    $('.input-field').val('');
    $('.input-field').focus();
}

const searchTodos = async elem => {
    searchedTerm = elem.val().toLowerCase().trim();

    const todos = await $.getJSON('/todos/api');
    const filtered = todos.filter(element => element.text.toLowerCase().includes(searchedTerm))
    // empty string "" always returns true in includes so when deleting the term keeps all items from the original todos array
    
    $('.todo-list').text('');
    showTodosFromDB(filtered);
    $('.search-input').focus();
}