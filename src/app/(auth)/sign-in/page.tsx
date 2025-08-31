import React from "react";
import AuthForm from "../../../components/AuthForm";
import { signIn } from "@/lib/auth/actions";

export default function SignInPage() {
  return <AuthForm mode="sign-in" onSubmit={signIn} />;
}