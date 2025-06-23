import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      toast.success("Logged in successfully!");
      setFormData({ email: "", password: "" });
      navigate("/dashboard");
    } catch (err) {
      toast.error("Invalid email or password");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-800 p-8 rounded-lg shadow-lg w-full max-w-md text-white"
      >
        <h2 className="text-3xl font-semibold mb-6 text-center">Login</h2>

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full mb-4 p-3 rounded bg-zinc-700 border border-zinc-600 placeholder-gray-400"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full mb-6 p-3 rounded bg-zinc-700 border border-zinc-600 placeholder-gray-400"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Login
        </button>
     
            <p className="text-xl pt-5 text-center font-semibold text-white">Don't have an account? <span onClick={()=>navigate("/register")} className="hover:underline cursor-pointer ">register here</span></p>
        
      </form>
    </div>
  );
};

export default Login;
