import { Metadata } from "next"

import LoginTemplate from "@modules/account/templates/login-template"

export const metadata: Metadata = {
  title: "Entrar",
  description: "Entre com sua conta na NovaTee",
}

export default function Login() {
  return <LoginTemplate />
}
