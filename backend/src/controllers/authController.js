import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";

const jwtSecret = process.env.JWT_SECRET || "troque_essa_chave";

function normalizeEmail(value) {
  return String(value ?? "").trim().toLowerCase();
}

export async function register(req, res) {
  try {
    const name = String(req.body?.name ?? "").trim();
    const email = normalizeEmail(req.body?.email);
    const password = String(req.body?.password ?? "");

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Nome, email e senha são obrigatórios",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "A senha deve ter pelo menos 6 caracteres",
      });
    }

    const usuarioExiste = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (usuarioExiste) {
      return res.status(400).json({
        message: "E-mail já cadastrado",
      });
    }

    const senhaHash = await bcrypt.hash(password, 10);

    const usuario = await prisma.user.create({
      data: {
        name,
        email,
        password: senhaHash,
      },
    });

    return res.status(201).json({
      message: "Usuário cadastrado com sucesso",
      usuario: {
        id: usuario.id,
        name: usuario.name,
        email: usuario.email,
      },
    });
  } catch (error) {
    console.error("Erro no cadastro:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
}

export async function login(req, res) {
  try {
    const email = normalizeEmail(req.body?.email);
    const password = String(req.body?.password ?? "");

    if (!email || !password) {
      return res.status(400).json({
        message: "Email e senha são obrigatórios",
      });
    }

    const usuario = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!usuario) {
      return res.status(401).json({
        message: "E-mail ou senha inválidos",
      });
    }

    const senhaValida = await bcrypt.compare(password, usuario.password);

    if (!senhaValida) {
      return res.status(401).json({
        message: "E-mail ou senha inválidos",
      });
    }

    const token = jwt.sign(
      { id: usuario.id },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    return res.status(200).json({
      message: "Login realizado com sucesso",
      token,
      usuario: {
        id: usuario.id,
        name: usuario.name,
        email: usuario.email,
      },
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
}
