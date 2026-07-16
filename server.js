

const express = require('express');
const app = express()
const port = 3000;

const tasks = [{
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
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})