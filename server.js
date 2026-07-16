

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');

const app = express()
const port = 3000;
app.use(express.json())
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
let tasks = [{
    id: 1,
    title: "Make the bed",
    done: true
}, {
    id: 2,
    title: "Wash the dishes",
    done: false
}, {
    id: 3,
    title: "feed the dog",
    done: false
}]
app.get('/', (req, res) => {
    res.json({
        "name": "Task API",
        "version": "1.0",
        "endpoints": ["/tasks"]
    })
})

app.get('/health', (req, res) => {
    res.status(200).json({
        "status": "ok"
    })
})

app.get('/tasks', (req, res) => {
    res.status(200).json({
        tasks
    })
})

app.get('/tasks/:id', (req, res) => {
    const { id } = req.params;

    const task = tasks.find((item) => {

        return item.id == Number(id)
    })

    if (!task)
        return res.status(404).json({
            error: `Task with id ${id} is not found`
        })

    return res.status(200).json({
        task: task
    })
})

app.post('/tasks', (req, res) => {

    const title = req.body.title;

    if (!title) {
        return res.status(400).json({
            error: "Cannot create a task with a missing title"
        });
    }

    const freeId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;

    console.log(`Assigning ID: ${freeId}`);

    const newTask = {
        id: freeId,
        title,
        done: false
    };

    tasks.push(newTask);
    res.status(201).json({
        task: newTask
    });
});

app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    if (!id)
        return res.status(400).json({
            error: 'An id must provided'
        })
    const task = tasks.find((item) => {
        return item.id == Number(id)
    })
    if (!task)
        return res.status(404).json({
            error: "Task was not found"
        })
    const { title, done } = req.body;
    if (!title && done === undefined)
        return res.status(400).json({
            error: 'You must add a title or done status to edit'
        })
    if (done !== undefined)
        task.done = done
    if (title)
        task.title = title

    return res.status(200).json({
        task
    })

})
app.delete("/tasks/:id", (req, res) => {
    const { id } = req.params;
    if (!id)
        return res.status(400).json({
            error: 'An id must provided'
        })
    const task = tasks.find((item) => {
        return item.id == Number(id)
    })
    if (!task)
        return res.status(404).json({
            error: "Task was not found"
        })
    
    tasks = tasks.filter((item) => item.id != Number(id))

    return res.status(204).json({})
})
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})