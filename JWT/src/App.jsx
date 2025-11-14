import { useState } from "react";

function App() {
  const [email, setEmail] = useState("teste@teste.com");
  const [password, setPassword] = useState("123456");
  const [token, setToken] = useState(sessionStorage.getItem("token") || "");
  const [privateMsg, setPrivateMsg] = useState("");
  const [error, setError] = useState("");

  async function login(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao fazer login");
        return;
      }

      sessionStorage.setItem("token", data.token);
      setToken(data.token);
    } catch (err) {
      setError("Falha de comunicação");
    }
  }

  async function loadPrivate() {
    setError("");
    try {
      const res = await fetch("http://localhost:3001/private", {
        headers: {
          Authorization: "Bearer " + token
        }
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro");
        setPrivateMsg("");
        return;
      }

      setPrivateMsg(data.message);
    } catch (err) {
      setError("Erro na requisição");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Login</h1>

      <form onSubmit={login}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
        />
        <br/>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="senha"
        />
        <br/>
        <button type="submit">Entrar</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {token && (
        <>
          <hr />
          <button onClick={loadPrivate}>Acessar rota privada</button>
          <p>{privateMsg}</p>
        </>
      )}
    </div>
  );
}

export default App;
