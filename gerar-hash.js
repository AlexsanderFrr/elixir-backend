const bcrypt = require('bcrypt');

const senha = "naoentreempanico";

bcrypt.hash(senha, 10, (err, hash) => {
    if (err) {
        console.error('Erro ao gerar hash:', err);
    } else {
        console.log('Hash gerado:', hash);
    }
});
