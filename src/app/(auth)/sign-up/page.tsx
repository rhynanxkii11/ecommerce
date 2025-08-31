import React from "react";
import AuthForm from "../../../components/AuthForm";
import { signUp } from "@/lib/auth/actions";

export default function SignUpPage() {
  return <AuthForm mode="sign-up" onSubmit={signUp} />;
}