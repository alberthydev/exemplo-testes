const { test, expect } = require('@playwright/test');

test.describe('Lista de Tarefas - Testes E2E', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Deve conter o título h1 correto', async ({ page }) => {
    const heading = page.locator('h1');
    await expect(heading).toHaveText('Lista de Tarefas');
  });

  test('Deve carregar com o input vazio e o botão visível', async ({ page }) => {
    const input = page.locator('#title');
    const botao = page.getByRole('button', { name: 'Adicionar' });

    await expect(input).toBeEmpty();
    await expect(botao).toBeVisible();
  });

  test('Deve adicionar uma tarefa e limpar o campo de texto', async ({ page }) => {
    const input = page.locator('#title');
    const botao = page.getByRole('button', { name: 'Adicionar' });

    await input.fill('Comprar leite');
    await botao.click();

    await expect(input).toBeEmpty();

    const itemLista = page.locator('ul#lista li').last();
    await expect(itemLista).toHaveText('Comprar leite');
  });

  test('Deve adicionar 3 tarefas em sequência', async ({ page }) => {
    const input = page.locator('#title');
    const botao = page.getByRole('button', { name: 'Adicionar' });
    
    const idUnico = Date.now();
    const t1 = `Seq A - 1 - ${idUnico}`;
    const t2 = `Seq B - 2 - ${idUnico}`;
    const t3 = `Seq C - 3 - ${idUnico}`;

    await input.fill(t1);
    const resposta1 = page.waitForResponse(response => response.url().includes('/tasks') && response.status() === 201);
    await botao.click();
    await resposta1;

    await input.fill(t2);
    const resposta2 = page.waitForResponse(response => response.url().includes('/tasks') && response.status() === 201);
    await botao.click();
    await resposta2;

    await input.fill(t3);
    const resposta3 = page.waitForResponse(response => response.url().includes('/tasks') && response.status() === 201);
    await botao.click();
    await resposta3;

    await expect(page.locator('ul#lista')).toContainText(t1);
    await expect(page.locator('ul#lista')).toContainText(t2);
    await expect(page.locator('ul#lista')).toContainText(t3);
  });

  test('Deve respeitar a ordem de inserção das tarefas', async ({ page }) => {
    const input = page.locator('#title');
    const botao = page.getByRole('button', { name: 'Adicionar' });

    const idUnico = Date.now();
    const primeira = `Primeira - ${idUnico}`;
    const segunda = `Segunda - ${idUnico}`;

    await input.fill(primeira);
    const resposta1 = page.waitForResponse(response => response.url().includes('/tasks') && response.status() === 201);
    await botao.click();
    await resposta1;

    await input.fill(segunda);
    const resposta2 = page.waitForResponse(response => response.url().includes('/tasks') && response.status() === 201);
    await botao.click();
    await resposta2;

    const itensDoTeste = page.locator('ul#lista li', { hasText: String(idUnico) });

    await expect(itensDoTeste.nth(0)).toHaveText(primeira);
    await expect(itensDoTeste.nth(1)).toHaveText(segunda);
  });

  test('Deve persistir a tarefa após o recarregamento da página', async ({ page }) => {
    const input = page.locator('#title');
    const botao = page.getByRole('button', { name: 'Adicionar' });

    const textoTarefa = 'Tarefa Persistente';
    await input.fill(textoTarefa);
    await botao.click();

    await page.reload();

    await expect(page.locator('ul#lista')).toContainText(textoTarefa);
  });

  test('Deve renderizar corretamente caracteres especiais', async ({ page }) => {
    const input = page.locator('#title');
    const botao = page.getByRole('button', { name: 'Adicionar' });

    const textoEspecial = 'Reunião às 18h & revisão';
    await input.fill(textoEspecial);
    await botao.click();

    await expect(page.locator('ul#lista')).toContainText(textoEspecial);
  });

  test('Deve ser possível submeter uma nova tarefa pressionando a tecla Enter', async ({ page }) => {
    const input = page.locator('#title');

    await input.fill('Tarefa via Enter');
    await page.keyboard.press('Enter');

    await expect(page.locator('ul#lista')).toContainText('Tarefa via Enter');
    await expect(input).toBeEmpty();
  });
});