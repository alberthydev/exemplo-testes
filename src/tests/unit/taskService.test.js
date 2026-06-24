const taskService = require("../../services/taskService");
const repository = require("../../repositories/taskRepository");

jest.mock("../../repositories/taskRepository");

describe("TaskService - Testes Unitários", () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("addTask('Estudar') deve retornar um objeto com id e title", () => {
        const resultado = taskService.addTask("Estudar");
        
        expect(resultado).toHaveProperty("id");
        expect(resultado).toHaveProperty("title", "Estudar");
    });

    test("addTask deve lançar erro se o título for uma string vazia", () => {
        expect(() => {
            taskService.addTask("");
        }).toThrow("Título obrigatório");
    });

    test("addTask deve lançar erro quando o título for um número", () => {
        expect(() => {
            taskService.addTask(42);
        }).toThrow("Título deve ser uma string");
    });

    test("addTask deve chamar repository.save exatamente uma vez", () => {
        taskService.addTask("Validar repositório");
        
        expect(repository.save).toHaveBeenCalledTimes(1);
    });

    test("getTasks deve retornar exatamente o que o repository.findAll retorna", () => {
        const mockLista = [{ id: 1, title: "Tarefa Mockada" }];
        repository.findAll.mockReturnValue(mockLista);

        const resultado = taskService.getTasks();

        expect(resultado).toEqual(mockLista);
        expect(repository.findAll).toHaveBeenCalledTimes(1);
    });

    test("addTask deve lançar erro 'Título muito curto' para menos de 3 caracteres", () => {
        expect(() => {
            taskService.addTask("Oi");
        }).toThrow("Título muito curto");
    });

    test("addTask deve lançar erro 'Título muito longo' para mais de 100 caracteres", () => {
        const tituloLongo = "a".repeat(101);
        expect(() => {
            taskService.addTask(tituloLongo);
        }).toThrow("Título muito longo");
    });

    describe("deleteTask", () => {
        test("deve chamar repository.delete com o id correto quando ele existir", () => {
            repository.findAll.mockReturnValue([{ id: 123, title: "Deletável" }]);

            taskService.deleteTask(123);

            expect(repository.delete).toHaveBeenCalledWith(123);
        });

        test("deve lançar erro se o id não existir no repositório", () => {
            repository.findAll.mockReturnValue([]);
            expect(() => {
                taskService.deleteTask(999);
            }).toThrow("ID não encontrado");
        });
    });

    test.each([
        [null, "Título obrigatório"],
        [undefined, "Título obrigatório"],
        [42, "Título deve ser uma string"],
        [["array"], "Título deve ser uma string"],
        [{ objeto: true }, "Título deve ser uma string"]
    ])("addTask(%p) deve falhar e jogar o erro esperado", (valorInvalido, erroEsperado) => {
        expect(() => {
            taskService.addTask(valorInvalido);
        }).toThrow(erroEsperado);
    });

    test("o id gerado deve ser diferente entre duas chamadas consecutivas", () => {
        const task1 = taskService.addTask("Tarefa Um");
        const originalDateNow = Date.now;
        
        try {
            jest.spyOn(Date, 'now')
                .mockReturnValueOnce(1000)
                .mockReturnValueOnce(1001);
                
            const t1 = taskService.addTask("Tarefa A");
            const t2 = taskService.addTask("Tarefa B");
            
            expect(t1.id).not.toBe(t2.id);
        } finally {
            Date.now = originalDateNow;
        }
    });
});