const request = require("supertest");
const app = require("../../app");
const repository = require("../../repositories/taskRepository");

describe("Tasks API - Testes de Integração", () => {
    describe("Operações com Repositório Limpo", () => {
        
        beforeEach(() => {
            repository.findAll().length = 0;
        });

        test("GET /tasks deve retornar status 200 e um array vazio inicialmente", async () => {
            const response = await request(app).get("/tasks");
            
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(0);
        });

        test("POST /tasks com title válido deve retornar status 201 e o objeto criado", async () => {
            const response = await request(app)
                .post("/tasks")
                .send({ title: "Nova Tarefa" });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("id");
            expect(response.body.title).toBe("Nova Tarefa");
        });

        test("POST /tasks sem title deve retornar status 400 e erro de título obrigatório", async () => {
            const response = await request(app)
                .post("/tasks")
                .send({});

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: "Título obrigatório" });
        });

        test("POST /tasks com title sendo um número deve retornar status 400", async () => {
            const response = await request(app)
                .post("/tasks")
                .send({ title: 123 });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("error");
        });

        test("Após um POST bem-sucedido, o GET /tasks deve listar a tarefa", async () => {
            const postResponse = await request(app)
                .post("/tasks")
                .send({ title: "Tarefa Integrada" });
            
            const tarefaCriada = postResponse.body;

            const getResponse = await request(app).get("/tasks");

            expect(getResponse.status).toBe(200);
            expect(getResponse.body.length).toBe(1);
            expect(getResponse.body[0]).toEqual(tarefaCriada);
        });

        test("POST /tasks com título menor que 3 caracteres deve retornar status 400", async () => {
            const response = await request(app)
                .post("/tasks")
                .send({ title: "Ab" });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: "Título muito curto" });
        });

        describe("DELETE /tasks/:id", () => {
            test("Deve retornar status 204 ao deletar um ID válido", async () => {
                const postResponse = await request(app)
                    .post("/tasks")
                    .send({ title: "Deletar me" });
                
                const id = postResponse.body.id;

                const deleteResponse = await request(app).delete(`/tasks/${id}`);
                expect(deleteResponse.status).toBe(204);

                const getResponse = await request(app).get("/tasks");
                expect(getResponse.body.length).toBe(0);
            });

            test("Deve retornar status 404 ao tentar deletar um ID inexistente", async () => {
                const response = await request(app).delete("/tasks/9999");
                expect(response.status).toBe(404);
            });
        });

        describe("GET /tasks/:id", () => {
            test("Deve retornar a tarefa específica se o ID existir", async () => {
                const postResponse = await request(app)
                    .post("/tasks")
                    .send({ title: "Buscar por ID" });
                
                const tarefaCriada = postResponse.body;

                const getResponse = await request(app).get(`/tasks/${tarefaCriada.id}`);
                expect(getResponse.status).toBe(200);
                expect(getResponse.body).toEqual(tarefaCriada);
            });

            test("Deve retornar status 404 se o ID não existir", async () => {
                const response = await request(app).get("/tasks/8888");
                expect(response.status).toBe(404);
            });
        });

        test.each([
            [{ title: "" }, "Título obrigatório"],
            [{ title: "Oi" }, "Título muito curto"],
            [{ title: "a".repeat(101) }, "Título muito longo"],
            [{ title: 999 }, "Título deve ser uma string"],
            [{ nome: "Objeto sem chave title" }, "Título obrigatório"]
        ])("POST /tasks com payload inválido %p deve retornar status 400 e o erro esperado", async (payloadInvalido, erroEsperado) => {
            const response = await request(app)
                .post("/tasks")
                .send(payloadInvalido);

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: erroEsperado });
        });
    });
});