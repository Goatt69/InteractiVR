"use client";

import React, { useState } from "react";
import { Config_URL } from "../../config/configURL";

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [selected, setSelected] = useState<"login" | "sign-up">("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [signUpError, setSignUpError] = useState("");
  const [signUpSuccess, setSignUpSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    
    if (!loginEmail) {
      setLoginError("Email is required");
      return;
    }
    if (!loginPassword) {
      setLoginError("Password is required");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(Config_URL.auth.login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      onLoginSuccess();
    } catch (error: any) {
      setLoginError(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError("");
    setSignUpSuccess("");
    
    if (!signUpName) {
      setSignUpError("Name is required");
      return;
    }
    if (!signUpEmail) {
      setSignUpError("Email is required");
      return;
    }
    if (!signUpPassword) {
      setSignUpError("Password is required");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(Config_URL.auth.register, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: signUpName,
          email: signUpEmail,
          password: signUpPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSignUpSuccess("Registration successful! You can now login.");
      setSignUpName("");
      setSignUpEmail("");
      setSignUpPassword("");
      setSelected("login");
    } catch (error: any) {
      setSignUpError(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed top-6 right-6 w-[360px] h-[480px] bg-white rounded-3xl shadow-xl p-8 z-50 ring-1 ring-gray-200">
      <div className="flex border-b border-gray-300 mb-6">
        <button
          className={`flex-1 py-3 text-center font-semibold transition-colors duration-300 ${
            selected === "login" ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-500 hover:text-blue-600"
          }`}
          onClick={() => setSelected("login")}
          aria-selected={selected === "login"}
          role="tab"
          id="tab-login"
          aria-controls="tabpanel-login"
        >
          Login
        </button>
        <button
          className={`flex-1 py-3 text-center font-semibold transition-colors duration-300 ${
            selected === "sign-up" ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-500 hover:text-blue-600"
          }`}
          onClick={() => setSelected("sign-up")}
          aria-selected={selected === "sign-up"}
          role="tab"
          id="tab-signup"
          aria-controls="tabpanel-signup"
        >
          Sign up
        </button>
      </div>

      {selected === "login" && (
        <div
          role="tabpanel"
          id="tabpanel-login"
          aria-labelledby="tab-login"
          className="overflow-hidden"
        >
          <form className="flex flex-col gap-3" onSubmit={handleLoginSubmit} noValidate>
            <label className="flex flex-col text-sm font-medium text-gray-700">
              Email
              <input
                required
                type="email"
                placeholder="Enter your email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-4 focus:ring-blue-500"
                aria-invalid={!!loginError}
                aria-describedby="login-email-error"
              />
            </label>
            <label className="flex flex-col text-sm font-medium text-gray-700">
              Password
              <input
                required
                type="password"
                placeholder="Enter your password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-4 focus:ring-blue-500"
                aria-invalid={!!loginError}
                aria-describedby="login-password-error"
              />
            </label>
            {loginError && <p id="login-email-error" className="text-red-600 text-sm mt-1">{loginError}</p>}
            <p className="text-center text-sm text-gray-600 mt-2">
              Need to create an account?{" "}
              <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={() => setSelected("sign-up")}
              >
                Sign up
              </button>
            </p>
            <div className="flex gap-2 justify-end mt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md shadow-md hover:bg-blue-700 transition disabled:bg-blue-400"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Login"}
              </button>
            </div>
          </form>
        </div>
      )}

      {selected === "sign-up" && (
        <div
          role="tabpanel"
          id="tabpanel-signup"
          aria-labelledby="tab-signup"
          className="overflow-hidden"
        >
          <form className="flex flex-col gap-4 h-[320px] justify-center px-2" onSubmit={handleSignUpSubmit} noValidate>
            <label className="flex flex-col text-sm font-medium text-gray-700">
              Name
              <input
                required
                type="text"
                placeholder="Enter your name"
                value={signUpName}
                onChange={(e) => setSignUpName(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-4 focus:ring-blue-600 transition"
                aria-invalid={!!signUpError}
                aria-describedby="signup-name-error"
              />
            </label>
            <label className="flex flex-col text-sm font-medium text-gray-700">
              Email
              <input
                required
                type="email"
                placeholder="Enter your email"
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-4 focus:ring-blue-500"
                aria-invalid={!!signUpError}
                aria-describedby="signup-email-error"
              />
            </label>
            <label className="flex flex-col text-sm font-medium text-gray-700">
              Password
              <input
                required
                type="password"
                placeholder="Enter your password"
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-4 focus:ring-blue-500"
                aria-invalid={!!signUpError}
                aria-describedby="signup-password-error"
              />
            </label>
            {signUpError && <p id="signup-name-error" className="text-red-600 text-sm mt-1">{signUpError}</p>}
            {signUpSuccess && <p className="text-green-600 text-sm mt-1">{signUpSuccess}</p>}
            <p className="text-center text-sm text-gray-600 mt-2">
              Already have an account?{" "}
              <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={() => setSelected("login")}
              >
                Login
              </button>
            </p>
            <div className="flex gap-2 justify-center mt-4">
              <button
                type="submit"
                className="w-full max-w-xs bg-blue-600 text-white py-2 rounded-md shadow-md hover:bg-blue-700 transition disabled:bg-blue-400"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Sign up"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}