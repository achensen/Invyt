import { useState, useContext } from "react";
import { registerUser } from "../utils/api";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

interface SignupForm {
  name: string;
  email: string;
  password: string;
}

const Signup = () => {
  const [form, setForm] = useState<SignupForm>({ name: "", email: "", password: "" });
  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  if (!userContext) return null;

  const { updateUser } = userContext;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await registerUser(form, updateUser);
    navigate("/");
  };

  return (
    <div className="container mt-4">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit} className="p-4 shadow-lg rounded bg-light">
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input className="form-control" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" name="password" value={form.password} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary w-100">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;