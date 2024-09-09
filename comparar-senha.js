const bcrypt = require('bcrypt');

const senha = "kingkiller";
const hashArmazenado = "$2b$10$tePDzHOMpPajOMssJ.oEsOrhgxdpybu33X1Cc9eRbUzUWPp6Ey3BO";

bcrypt.compare(senha, hashArmazenado, (err, result) => {
    if (err) {
        console.error('Erro na comparação:', err);
    } else {
        console.log('Senha válida:', result); // Deve retornar true
    }
});
