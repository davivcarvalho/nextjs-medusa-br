import React from "react"

import UnderlineLink from "@modules/common/components/interactive-link"

import AccountNav from "../components/account-nav"
import { Customer } from "@medusajs/medusa"

interface AccountLayoutProps {
  customer: Omit<Customer, "password_hash"> | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  return (
    <div className="flex-1 small:py-12">
      <div className="flex-1 content-container h-full max-w-5xl mx-auto bg-white flex flex-col">
        <div
          className={
            "grid grid-cols-1 py-12 " +
            (customer && "small:grid-cols-[240px_1fr]")
          }
        >
          <div>{customer && <AccountNav customer={customer} />}</div>
          <div className="flex-1">{children}</div>
        </div>
        <div className="flex flex-col small:flex-row items-center justify-between small:border-t border-gray-200 py-12 gap-8">
          <div>
            <h3 className="text-xl-semi mb-4">Tem alguma dúvida?</h3>
            <span className="txt-medium">
              Você pode encontrar perguntas e respostas frequentes em nossa
              página de atendimento ao cliente.
            </span>
          </div>
          <div>
            <UnderlineLink href="/customer-service">
              Atendimento ao Cliente
            </UnderlineLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout
