import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // ✅ also import this

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/users/create-user",
        formData,
        {
          withCredentials: true,
        }
      );

      toast.success("Registered Successfully"); // ✅ fixed spelling
      setFormData({ fullName: "", email: "", password: "" });
      navigate("/login"); // ✅ this now works
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-800 p-8 rounded-lg shadow-lg w-full max-w-md text-white"
      >
        <h2 className="text-3xl font-semibold mb-6 text-center">Register</h2>

        <input
          name="fullName"
          type="text"
          value={formData.fullName}
          placeholder="Full Name"
          onChange={handleChange}
          className="w-full mb-4 p-3 rounded bg-zinc-700 border border-zinc-600 placeholder-gray-400"
        />

        <input
          name="email"
          type="email"
          value={formData.email}
          placeholder="Email"
          onChange={handleChange}
          className="w-full mb-4 p-3 rounded bg-zinc-700 border border-zinc-600 placeholder-gray-400"
        />

        <input
          name="password"
          type="password"
          value={formData.password}
          placeholder="Password"
          onChange={handleChange}
          className="w-full mb-6 p-3 rounded bg-zinc-700 border border-zinc-600 placeholder-gray-400"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white py-2 rounded font-medium"
        >
          Register
        </button>
        <p className="text-xl pt-5 text-center font-semibold text-white">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="hover:underline cursor-pointer "
          >
            Login here
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;
