import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  return res.status(200).json({
    status: "ok",
    message: "API funcionando",
  });
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.use((req, res) => {
  return res.status(404).json({
    message: "Rota não encontrada",
  });
});

app.use((error, req, res, next) => {
  console.error("Erro não tratado:", error);

  return res.status(500).json({
    message: "Erro interno do servidor",
  });
});

export default app;
