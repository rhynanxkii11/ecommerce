"use client";

import React, { useState } from "react";
import SocialProviders from "./SocialProviders";
import Link from "next/link";

interface AuthFormProps {
  mode: "sign-in" | "sign-up";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log(mode, form);
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-caption text-dark-700">
          {mode === "sign-in"
            ? "Don’t have an account? "
            : "Already have an account? "}
          <Link
            href={mode === "sign-in" ? "/sign-up" : "/sign-in"}
            className="underline"
          >
            {mode === "sign-in" ? "Sign Up" : "Sign In"}
          </Link>
        </p>

        <h1 className="mt-3 text-heading-3 text-dark-900">
          {mode === "sign-in" ? "Welcome Back!" : "Join Nike Today!"}
        </h1>
        <p className="mt-1 text-body text-dark-700">
          {mode === "sign-in"
            ? "Sign in to continue your journey"
            : "Create your account to start your fitness journey"}
        </p>
      </div>

      <SocialProviders variant={mode} />

      <form onSubmit={handleSubmit} className="space-y-4" aria-label={mode}>
        {mode === "sign-up" && (
          <div>
            <label htmlFor="name" className="block text-sm mb-1">
              Full name
            </label>
            <input
              id="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-md border border-light-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[--color-dark-500]"
              placeholder="Jane Doe"
              required
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-md border border-light-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[--color-dark-500]"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-md border border-light-300 px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[--color-dark-500]"
              placeholder="••••••••"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-sm text-dark-500 hover:text-dark-700"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-dark-900 text-white py-2 text-sm hover:opacity-95 transition-opacity"
        >
          {mode === "sign-in" ? "Sign in" : "Create account"}
        </button>
      </form>
    </div>
  );
}