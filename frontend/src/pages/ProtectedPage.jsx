import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { getToken, removeToken } from "../services/auth.js";

export default function ProtectedPage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  function handleLogout() {
    removeToken();
    navigate("/login", { replace: true });
  }

  useEffect(() => {
    async function loadProfile() {
      const token = getToken();

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const response = await api.get("/users/profile");
        setUser(response.data.user);
      } catch (requestError) {
        if ([401, 403].includes(requestError.response?.status)) {
          removeToken();
          navigate("/login", { replace: true });
          return;
        }

        setError(
          requestError.response?.data?.message ||
            "Não foi possível carregar o perfil.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [navigate]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8">
        <p role="status" className="text-gray-600">Carregando perfil...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8">
        <section className="w-full max-w-lg rounded-xl bg-white p-6 text-center shadow-md sm:p-8">
          <p role="alert" className="mb-5 text-red-600">
            {error || "Não foi possível carregar o perfil."}
          </p>
          <button
            type="button"
            onClick={() => navigate("/login", { replace: true })}
            className="w-full rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
          >
            Voltar para o login
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8">
      <section className="w-full max-w-lg rounded-xl bg-white p-6 shadow-md sm:p-8">
        <h1 className="mb-4 text-center text-2xl font-bold text-gray-900">Área Protegida</h1>
        <p role="status" className="mb-5 rounded-md bg-green-50 p-3 text-center text-green-700">Sessão autenticada</p>
        {error && <p role="alert" className="mb-4 text-red-600">{error}</p>}

        <div className="mb-6 space-y-2 rounded-md border border-gray-200 p-4 text-gray-700">
          <h2 className="font-semibold text-gray-900">Dados do usuário</h2>
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Nome:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>

        <button type="button" onClick={handleLogout} className="w-full rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
          Sair
        </button>
      </section>
    </main>
  );
}
