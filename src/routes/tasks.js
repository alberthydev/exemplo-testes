const express = require("express");
const router = express.Router();

const taskService = require("../services/taskService");

router.get("/", (req, res) => {
    res.json(taskService.getTasks());
});

router.get("/:id", (req, res) => {
    const tasks = taskService.getTasks();
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    
    if (!task) {
        return res.status(404).json({ error: "Tarefa não encontrada" });
    }
    
    res.json(task);
});

router.post("/", express.json(), (req, res) => {
    try {
        const task = taskService.addTask(req.body.title);

        res.status(201).json(task);

    } catch (err) {
        res.status(400).json({
            error: err.message
        });
    }
});

router.delete("/:id", (req, res) => {
    try {
        taskService.deleteTask(parseInt(req.params.id));
        res.status(204).send(); // 204 No Content
    } catch (err) {
        res.status(404).json({
            error: err.message
        });
    }
});

module.exports = router;