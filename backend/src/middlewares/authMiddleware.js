import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";

const jwtSecret = process.env.JWT_SECRET || "troque_essa_chave";

export default async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Token não informado",
    });
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer" || !parts[1]) {
    return res.status(401).json({
      message: "Token inválido",
    });
  }

  const [, token] = parts;

  let decoded;

  try {
    decoded = jwt.verify(token, jwtSecret);
  } catch (error) {
    return res.status(401).json({
      message: error.name === "TokenExpiredError" ? "Token expirado" : "Token inválido",
    });
  }

  const usuario = await prisma.user.findUnique({
    where: {
      id: decoded.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (!usuario) {
    return res.status(401).json({
      message: "Usuário não encontrado",
    });
  }

  req.user = usuario;
  return next();
}
