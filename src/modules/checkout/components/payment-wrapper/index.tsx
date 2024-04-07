"use client"

import { Cart, PaymentSession } from "@medusajs/medusa"
import { loadStripe } from "@stripe/stripe-js"
import React, { useContext, useState } from "react"
import StripeWrapper from "./stripe-wrapper"
import { PayPalScriptProvider } from "@paypal/react-paypal-js"
import { createContext } from "react"

type WrapperProps = {
  cart: Omit<Cart, "refundable_amount" | "refunded_total">
  children: React.ReactNode
}

type StripeContextType = {
  paymentMethod: "card" | "boleto" | null
  setPaymentMethod: (value: StripeContextType["paymentMethod"]) => void
  stripeReady: boolean
}
export const StripeContext = createContext({
  stripeReady: false,
} as StripeContextType)

export const useStripeContext = () => useContext(StripeContext)

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_KEY
const stripePromise = stripeKey ? loadStripe(stripeKey) : null

const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

const Wrapper: React.FC<WrapperProps> = ({ cart, children }) => {
  const [paymentMethod, setPaymentMethod] =
    useState<StripeContextType["paymentMethod"]>(null)

  const paymentSession = cart.payment_session as PaymentSession

  const isStripe = paymentSession?.provider_id?.includes("stripe")

  if (isStripe && paymentSession && stripePromise) {
    return (
      <StripeContext.Provider
        value={{
          stripeReady: true,
          paymentMethod,
          setPaymentMethod,
        }}
      >
        <StripeWrapper
          paymentSession={paymentSession}
          stripeKey={stripeKey}
          stripePromise={stripePromise}
        >
          {children}
        </StripeWrapper>
      </StripeContext.Provider>
    )
  }

  return <div>{children}</div>
}

export default Wrapper
