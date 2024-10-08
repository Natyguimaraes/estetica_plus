const { getUserById, connection } = require('./db');

describe('Testes para getUserById', () => {

  //criar uma tabela nova no banco de dados com o nome "agendamento" caso não exista tabela ainda no banco de dados.
  //inserir campos na tabela com o Insert into

  beforeAll(async () => {
    await connection.query("CREATE TABLE IF NOT EXISTS agendamento (id INT AUTO_INCREMENT PRIMARY KEY, nome_pessoa VARCHAR(255), contato VARCHAR(20), email VARCHAR(255), data_agendamento VARCHAR(20))");
    await connection.query("INSERT INTO agendamento (nome_pessoa, contato, email, data_agendamento) VALUES ('Natália Guimarães', '75999999999', 'email@email.com', '2024-10-11')");
  });

  afterAll(async () => {
    //await connection.query("TRUNCATE TABLE agendamento"); // Limpeza da tabela após os testes
    await connection.end();
  });
   

  //teste 1 para leitura de dados

  test('deve retornar o usuário correto pelo id', async () => {

    const inicio = performance.now();
    const user = await getUserById(2);
    const fim = performance.now();

    const duracao = fim - inicio;
    console.log(`Tempo de execução: ${duracao.toFixed(2)} ms`);  
    expect(duracao).toBeLessThanOrEqual(100);

    expect(user).toHaveProperty('nome_pessoa', 'Augusto Guimarães');
    expect(user).toHaveProperty('contato', '75999999999');
    expect(user).toHaveProperty('email', 'email@email.com');
    expect(user).toHaveProperty('data_agendamento', '2024-10-11');

    console.log(`Usuário: `, user);
  });

  test('Verificar se getUserById responde em menos de 50ms', async () => {
    const inicio = performance.now();
    await getUserById(2);
    const fim = performance.now();

    const duracao = fim - inicio;
    console.log(`Tempo de execução: ${duracao.toFixed(2)} ms`);
    expect(duracao).toBeLessThanOrEqual(50);
  });


  test('Atualização de agendamento', async () => {
    // Inserir um registro

    const [result] = await connection.execute(
      'UPDATE agendamento SET nome_pessoa = ? WHERE id = ?',
      ['Augusto Guimarães', 2] // Certifique-se de que o ID 2 exist
    );

    expect(result.affectedRows).toBe(1);

    const updateUser = await getUserById(2);
    expect(updateUser).toHaveProperty('nome_pessoa', 'Augusto Guimarães');
  });


  /*test('Delete agendamento', async () => {
    const [result] = await connection.execute(
      'DELETE FROM agendamento WHERE id = ?',
      [1] // Certifique-se de que o ID foi criado anteriormente
    );                                                                                    

    expect(result.affectedRows).toBe(1);

    const deleteUser = await getUserById(1);
    expect(deleteUser).toBeNull();
  });
});
*/
  test('verifica se parte do nome está presente', async () => {
    const agendamento = await getUserById(2);
    expect(agendamento.nome_pessoa).toMatch(/Aug/);
  });
});


