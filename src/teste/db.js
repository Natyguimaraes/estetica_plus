const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'123456789',
    database: 'esteticaplus'
});


async function getUserById(id) {
    const [rows] = await connection.query('SELECT * FROM agendamentos WHERE id = ?', [id]);
    return rows[0];
}

module.exports = { getUserById, connection };