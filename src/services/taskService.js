const repository = require("../repositories/taskRepository");

function addTask(title) {

    if (!title) {
        throw new Error("Título obrigatório");
    }

    if (typeof title !== 'string') {
        throw new Error("Título deve ser uma string");
    }

    if (title.length < 3) {
        throw new Error("Título muito curto");
    }

    if (title.length > 100) {
        throw new Error("Título muito longo");
    }

    const task = {
        id: Date.now(),
        title
    };

    repository.save(task);

    return task;
}

function getTasks() {
    return repository.findAll();
}

function deleteTask(id) {
    const tasks = repository.findAll();
    const exists = tasks.some(t => t.id === id);

    if (!exists) {
        throw new Error("ID não encontrado");
    }

    repository.delete(id);
}

module.exports = {
    addTask,
    getTasks,
    deleteTask
};