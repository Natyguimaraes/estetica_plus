const express = require('express');
const app = express();
const { getUserById } = require ('./db');

app.get('/agendamentos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await getUserById(id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'Usuario não existe'});
        } 
    } catch (error) {
        res.status(500).json({ message: 'Erro de conexão com o bd'});

    }
});

module.exports = app;