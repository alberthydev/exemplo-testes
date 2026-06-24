const tasks = [];

function save(task) {
    tasks.push(task);
}

function findAll() {
    return tasks;
}

function remove(id) {
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
        tasks.splice(index, 1);
        return true;
    }
    return false;
}

module.exports = {
    save,
    findAll,
    delete: remove
};