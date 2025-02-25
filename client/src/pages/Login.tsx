import { useState, useContext } from "react";
import { loginUser } from "../utils/api";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

interface LoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  if (!userContext) return null;

  const { updateUser } = userContext;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await loginUser(form, updateUser); // ✅ Pass `updateUser` as second argument
    navigate("/");
  };

  return (
    <div className="container mt-4">
      <h1>Login</h1>
      <form onSubmit={handleSubmit} className="p-4 shadow-lg rounded bg-light">
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" name="password" value={form.password} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
};

export default Login;
