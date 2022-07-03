const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo')

router.get('/api', async (req, res) => {
    const todos = await Todo.find() // returns array of objects from the collection
    res.send(todos)
})

router.post('/api', async (req, res) => {
    const todo = new Todo({
        text: req.body.text
    })
    try{
        await todo.save()
        res.send(todo)
    }
    catch (err) {
        res.send(400, err)
    }
})

router.put('/api/:id', async (req, res) => {
    const todo = await Todo.findById(req.params.id);
    // if any of the todo's requested fields are different - change to requested field from request
    for(let key in req.body){
        if(todo[key] != req.body[key]){
            todo[key] = req.body[key];
        }
    }
    try{
        await todo.save();
        res.send(todo)
    }
    catch (error) {
        res.send(400, error)
    }
})

router.delete('/api/:id', async (req, res) => {
    const todo = await Todo.findById(req.params.id);
    try{
        todo.remove();
        res.send({message: 'todo removed'})
    }
    catch (err) {
        res.send(400, error)
    }
});

module.exports = router;