"use client"

import { Cart, PaymentSession } from "@medusajs/medusa"
import { Button } from "@medusajs/ui"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import React, { useState } from "react"
import ErrorMessage from "../error-message"
import { useStripeContext } from "../payment-wrapper"
import { placeOrder } from "@modules/checkout/actions"
import { medusaClient } from "@lib/config"

type PaymentButtonProps = {
  cart: Omit<Cart, "refundable_amount" | "refunded_total">
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ cart }) => {
  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    cart.shipping_methods.length < 1
      ? true
      : false

  const paymentSession = cart.payment_session as PaymentSession

  switch (paymentSession.provider_id) {
    case "stripe":
      return <StripePaymentButton notReady={notReady} cart={cart} />
    default:
      return <Button disabled>Selecione um método de pagamento</Button>
  }
}

const StripePaymentButton = ({
  cart,
  notReady,
}: {
  cart: Omit<Cart, "refundable_amount" | "refunded_total">
  notReady: boolean
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { paymentMethod } = useStripeContext()

  const stripe = useStripe()
  const elements = useElements()

  const disabled = !stripe || !elements || !paymentMethod

  const handlePayment = async () => {
    setSubmitting(true)

    await medusaClient.carts.update(cart.id, {
      context: { paymentMethod },
    })

    if (!stripe || !elements || !cart) {
      setSubmitting(false)
      setErrorMessage("Falha ao processar o pagamento, tente novamente!")
      return
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        payment_method_data: {
          billing_details: {
            name:
              cart.billing_address.first_name +
              " " +
              cart.billing_address.last_name,
            address: {
              city: cart.billing_address.city ?? undefined,
              country: cart.billing_address.country_code ?? undefined,
              line1: cart.billing_address.address_1 ?? undefined,
              line2: cart.billing_address.address_2 ?? undefined,
              postal_code: cart.billing_address.postal_code ?? undefined,
              state: cart.billing_address.province ?? undefined,
            },
            email: cart.email,
            phone: cart.billing_address.phone ?? undefined,
          },
        },
      },
      redirect: "if_required",
    })

    if (error) {
      setErrorMessage(error.message || "Erro ao processar o pagamento")
      setSubmitting(false)
      return
    }

    if (
      paymentIntent?.status === "succeeded" ||
      paymentIntent?.status === "requires_capture" ||
      (paymentIntent?.status === "requires_action" &&
        paymentMethod === "boleto")
    ) {
      try {
        await placeOrder()
      } catch (error) {
        setErrorMessage("Erro ao processar o pedido")
        setSubmitting(false)
      }

      return
    }

    setSubmitting(false)
    setErrorMessage("Falha ao processar o pagamento, tente novamente!")
  }

  return (
    <>
      <Button
        disabled={disabled || notReady}
        onClick={handlePayment}
        size="large"
        isLoading={submitting}
      >
        Finalizar Pedido
      </Button>
      <ErrorMessage error={errorMessage} />
    </>
  )
}

export default PaymentButton
