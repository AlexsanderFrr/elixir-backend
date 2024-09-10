const bcrypt = require('bcrypt');

const senha = 'carneiro';
const hash = '$2b$10$CxoqACrUz0XOLChxIgCq4OlL5xW0YqdAhT3ZS19z5PF1vqSUf.lhS';

bcrypt.compare(senha, hash, (err, res) => {
    if (err) {
        console.log('Erro na comparação:', err);
    } else {
        console.log('Senha válida:', res);
    }
});
