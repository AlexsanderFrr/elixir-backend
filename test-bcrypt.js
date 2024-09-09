const bcrypt = require('bcrypt');

const senha = 'naoentreempanico';
const hash = '$2b$10$6Nxz4JbjG1MXcfiRDnhqZ.hqtTp6RjUHJEEg7wNuB4jyhE0mpZysG'; // Substitua pelo hash armazenado no seu banco de dados

bcrypt.compare(senha, hash, (err, res) => {
    if (err) {
        console.log('Erro na comparação:', err);
    } else {
        console.log('Senha válida:', res);
    }
});
