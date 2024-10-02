const mysql = require('mysql2/promise');

let connection;

beforeAll(async () => {
  connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root', // Altere para o seu usuário
    password: '123456789', // Altere para sua senha
    database: 'estetica_plus' // Altere para o nome do seu banco
  });

  // Limpa a tabela antes de iniciar os testes
  await connection.query('DELETE FROM agendamento');
});

afterAll(async () => {
    await connection.end();
  });
  

describe('CRUD de Agendamento', () => {
  let agendamentoId;

  test('Inserção de novo agendamento', async () => {
    const agendamento = {
      nome_pessoa: 'João Silva',
      contato_telefonico: '11999999999',
      email: 'joao@example.com',
      data_agendamento: '2024-10-10'
    };

    
    
    const [result] = await connection.execute('INSERT INTO agendamento (nome_pessoa, contato_telefonico, email, data_agendamento) VALUES (?, ?, ?, ?)', 
      [agendamento.nome_pessoa, agendamento.contato_telefonico, agendamento.email, agendamento.data_agendamento]);
    
    agendamentoId = result.insertId; // Armazena o ID do agendamento inserido
    expect(result.affectedRows).toBe(1);
  });

  test('Leitura de dados - Select em tabela', async () => {
    const [rows] = await connection.query('SELECT * FROM agendamento');
    expect(rows.length).toBeGreaterThan(0);
  });

  test('Select com nome específico', async () => {
    const [rows] = await connection.query('SELECT * FROM agendamento WHERE nome_pessoa = ?', ['João Silva']);
    expect(rows.length).toBe(1);
  });

  test('Selecionar por parte do nome', async () => {
    const [rows] = await connection.query('SELECT * FROM agendamento WHERE nome_pessoa LIKE ?', ['João%']);
    expect(rows.length).toBeGreaterThan(0);
  });

  test('Selecionar por intervalo de datas', async () => {
    const [rows] = await connection.query('SELECT * FROM agendamento WHERE data_agendamento BETWEEN ? AND ?', ['2024-10-01', '2024-10-31']);
    expect(rows.length).toBeGreaterThan(0);
  });

  test('Atualização de agendamento', async () => {
    const [result] = await connection.execute('UPDATE agendamento SET nome_pessoa = ? WHERE id_agenda = ?', ['Carlos Silva', agendamentoId]);
    expect(result.affectedRows).toBe(1);
  });

  test('Deleção de agendamento', async () => {
    const [result] = await connection.execute('DELETE FROM agendamento WHERE id_agenda = ?', [agendamentoId]);
    expect(result.affectedRows).toBe(1);
  });
});
