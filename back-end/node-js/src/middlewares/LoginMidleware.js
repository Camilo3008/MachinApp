import Jwt from "jsonwebtoken";

export const verificar = (req, res, next) => {
  const header = req.header("Authorization") || "";
  const token = header.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Tu conexión ha expirado. Vuelve a hacer login.",
      estado: 401,
    });
  }
  try {
    const paylod = Jwt.verify(token, process.env.AUTH_SECRET);
    
    req.user = paylod.user;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token no valido" });
  }
};
