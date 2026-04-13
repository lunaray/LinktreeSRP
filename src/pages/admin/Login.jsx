import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../state/context/authContext";
import { Lock } from "lucide-react";

const Login = () => {
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isLoggedIn) {
    navigate("/admin/dashboard", { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin/dashboard", { replace: true });
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <Card>
        <LockIcon><Lock size={32} /></LockIcon>
        <Title>Admin Login</Title>
        <form onSubmit={handleSubmit}>
          <Field>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </Field>
          <Field>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </Field>
          {error && <ErrorMsg>{error}</ErrorMsg>}
          <SubmitBtn type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </SubmitBtn>
        </form>
      </Card>
    </Page>
  );
};

export default Login;

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0f0f0f;
`;

const Card = styled.div`
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 380px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
`;

const LockIcon = styled.div`
  display: flex;
  justify-content: center;
  color: #7c3aed;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  color: white;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.4rem;
`;

const Field = styled.div`
  margin-bottom: 1rem;
  label {
    display: block;
    color: #aaa;
    font-size: 0.85rem;
    margin-bottom: 0.4rem;
  }
  input {
    width: 100%;
    background: #111;
    border: 1px solid #444;
    border-radius: 8px;
    padding: 0.6rem 0.8rem;
    color: white;
    font-size: 1rem;
    outline: none;
    box-sizing: border-box;
    &:focus {
      border-color: #7c3aed;
    }
  }
`;

const ErrorMsg = styled.p`
  color: #f87171;
  font-size: 0.85rem;
  margin-bottom: 0.8rem;
`;

const SubmitBtn = styled.button`
  width: 100%;
  background: #7c3aed;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 0.5rem;
  &:hover:not(:disabled) { background: #6d28d9; }
  &:disabled { opacity: 0.6; cursor: default; }
`;
