// middleware/auth.js
const isAdmin = (req, res, next) => {
  // Pressupõe que authenticateToken já rodou e adicionou req.user
  if (!req.user?.tipo) {
    return res.status(401).json({ message: 'Usuário não autenticado' });
  }

  if (req.user.tipo !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado: requer privilégios de administrador' });
  }

  next(); // Se chegou aqui, é admin
};

module.exports = { authenticateToken, isAdmin };