import { useState } from "react";
import { LoginPage } from "./components/LoginPage";
import "./index.css";

function App() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (payload: {
    email: string;
    password: string;
    remember: boolean;
  }) => {
    setLoading(true);
    setErrorMsg("");

    // Replace with your real auth logic
    await new Promise((r) => setTimeout(r, 500));

    if (payload.email === "demo@example.com" && payload.password === "1234") {
      alert("Login successful!");
    } else {
      setErrorMsg("Invalid email or password.");
    }

    setLoading(false);
  };

  return (
    <LoginPage
      brandName="YourBrand"
      title="清风，欢迎你!"
      subtitle="Please enter your details"
      primaryColor="#4f46e5"
      onSubmit={handleLogin}
      loading={loading}
      errorMsg={errorMsg}
    />
  );
}

export default App;
