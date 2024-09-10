const bcrypt = require('bcrypt');

const senha = 'naoentreempanicooo';
const hash = '$2b$10$X83bGjOHbgoZxxKdaz2ZsegjhRTD6z3jwYwpQPVxpLob.Cw/kMTjy'; // Substitua pelo hash armazenado no seu banco de dados

bcrypt.compare(senha, hash, (err, res) => {
    if (err) {
        console.log('Erro na comparação:', err);
    } else {
        console.log('Senha válida:', res);
    }
});
