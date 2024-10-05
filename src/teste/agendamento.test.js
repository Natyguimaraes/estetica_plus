const { getUserById, connection } = require('./db');

describe('Testes para getUserById', () => {
  beforeAll(async () => {
    await connection.query("CREATE TABLE IF NOT EXISTS agendamento (id INT AUTO_INCREMENT PRIMARY KEY, nome_pessoa VARCHAR(255), contato VARCHAR(20), email VARCHAR(255), data_agendamento VARCHAR(20))");
    await connection.query("INSERT INTO agendamento (nome_pessoa, contato, email, data_agendamento) VALUES ('Natália Guimarães', '75999999999', 'email@email.com', '2024-10-11')");
  });

  afterAll(async () => {
    //await connection.query("TRUNCATE TABLE agendamento"); // Limpeza da tabela após os testes
    await connection.end();
  });

  test('deve retornar o usuário correto pelo id', async () => {
    const inicio = performance.now();
    const user = await getUserById(1);
    const fim = performance.now();

    const duracao = fim - inicio;
    console.log(`Tempo de execução: ${duracao.toFixed(2)} ms`);
    expect(duracao).toBeLessThanOrEqual(100);

    expect(user).toHaveProperty('nome_pessoa', 'Natália Guimarães');
    expect(user).toHaveProperty('contato', '75999999999');
    expect(user).toHaveProperty('email', 'email@email.com');
    expect(user).toHaveProperty('data_agendamento', '2024-10-11');
  });

  test('Verificar se getUserById responde em menos de 50ms', async () => {
    const inicio = performance.now();
    await getUserById(1);
    const fim = performance.now();

    const duracao = fim - inicio;
    console.log(`Tempo de execução: ${duracao.toFixed(2)} ms`);
    expect(duracao).toBeLessThanOrEqual(50);
  });

  test('Atualização de agendamento', async () => {
    // Primeiro, insira um registro que realmente exista
    await connection.query("INSERT INTO agendamento (nome_pessoa, contato, email, data_agendamento) VALUES ('Usuario Teste', '75999999998', 'test@email.com', '2024-10-12')");

    const [result] = await connection.execute(
      'UPDATE agendamento SET nome_pessoa = ? WHERE id = ?',
      ['Natália Guimarães', 3] // Certifique-se de que o ID 2 existe
    );

    expect(result.affectedRows).toBe(1);

    const updateUser = await getUserById(3);
    expect(updateUser).toHaveProperty('nome_pessoa', 'Natália Guimarães');
  });

  test('Delete agendamento', async () => {
    const [result] = await connection.execute(
      'DELETE FROM agendamento WHERE id = ?',
      [1] // Certifique-se de que o ID 2 foi criado anteriormente
    );

    expect(result.affectedRows).toBe(1);

    const deleteUser = await getUserById(1);
    expect(deleteUser).toBeNull();
  });

  test('verifica se parte do nome está presente', async () => {
    const agendamento = await getUserById(1);
    expect(agendamento.nome_pessoa).toMatch(/Nat/);
  });
});

/*describe('CRUD de Agendamento', () => {
  let agendamentoId;

  test('Inserção de novo agendamento', async () => {
    const agendamento = {
      nome_pessoa: 'João Silva',
      contato_telefonico: '11999999999',
      email: 'joao@example.com',
      data_agendamento: '2024-10-10'
    };

    
    
    const [result] = await connection.execute('INSERT INTO agendamentos (nome_pessoa, contato_telefonico, email, data_agendamento) VALUES (?, ?, ?, ?)', 
      [agendamento.nome_pessoa, agendamento.contato_telefonico, agendamento.email, agendamento.data_agendamento]);
    
    agendamentoId = result.insertId; // Armazena o ID do agendamento inserido
    expect(result.affectedRows).toBe(1);
  });

  test('Leitura de dados - Select em tabela', async () => {
    const [rows] = await connection.query('SELECT * FROM agendamentos');
    expect(rows.length).toBeGreaterThan(0);
  });

  test('Select com nome específico', async () => {
    const [rows] = await connection.query('SELECT * FROM agendamentos WHERE nome_pessoa = ?', ['João Silva']);
    expect(rows.length).toBe(1);
  });

  test('Selecionar por parte do nome', async () => {
    const [rows] = await connection.query('SELECT * FROM agendamentos WHERE nome_pessoa LIKE ?', ['João%']);
    expect(rows.length).toBeGreaterThan(0);
  });

  test('Selecionar por intervalo de datas', async () => {
    const [rows] = await connection.query('SELECT * FROM agendamentos WHERE data_agendamento BETWEEN ? AND ?', ['2024-10-01', '2024-10-31']);
    expect(rows.length).toBeGreaterThan(0);
  });

  test('Atualização de agendamento', async () => {
    const [result] = await connection.execute('UPDATE agendamentos SET nome_pessoa = ? WHERE id_agenda = ?', ['Carlos Silva', agendamentoId]);
    expect(result.affectedRows).toBe(1);
  });

  test('Deleção de agendamento', async () => {
    const [result] = await connection.execute('DELETE FROM agendamentos WHERE id_agenda = ?', [agendamentoId]);
    expect(result.affectedRows).toBe(1);
  });
});
*/