import jwt from "jsonwebtoken";

export const isAdmin = async (req, res, next) => {
  try {
    const header = req.header("Authorization") || "";
    const token = header.split(" ")[1];

    const llave = process.env.AUTH_SECRET;
    jwt.verify(token, llave, (err, decode) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("", decode.user.rol_nombre);
      if (decode.user.rol_nombre === "Administrador") {
        next();
      } else {
        res.status(403).json({ menseje: "No tienes permiso para esta acción" });
      }
    });
  } catch (error) {
    return res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

export const adminAndInstructor = async (req, res, next) => {
  try {
    const header = req.header("Authorization") || "";
    const token = header.split(" ")[1];

    const llave = process.env.AUTH_SECRET;
    jwt.verify(token, llave, (err, decode) => {
      if (err) {
        console.error(err);
        return;
      }
      const adminOrInstru = decode.user.rol_nombre;

      if (adminOrInstru === "Administrador" || adminOrInstru === "Instructor") {
        next();
      } else {
        res.status(403).json({ menseje: "No tienes permiso para esta acción" });
      }
    });
  } catch (error) {
    return res.status(500).json({ mensaje: "Error en el servidor" });
  }
};