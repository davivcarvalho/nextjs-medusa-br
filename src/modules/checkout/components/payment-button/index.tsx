"use client"

import { Cart, PaymentSession } from "@medusajs/medusa"
import { Button } from "@medusajs/ui"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import { placeOrder } from "@modules/checkout/actions"
import React, { useState } from "react"
import ErrorMessage from "../error-message"
import { useStripeContext } from "../payment-wrapper"

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

  const onPaymentCompleted = async () => {
    await placeOrder().catch(() => {
      setErrorMessage("Ocorreu um erro desconhecido, tente novamente.")
      setSubmitting(false)
    })
  }

  const stripe = useStripe()
  const elements = useElements()
  const card = elements?.getElement("card")

  const session = cart.payment_session as PaymentSession

  const disabled = !stripe || !elements || !paymentMethod

  const handlePayment = async () => {
    setSubmitting(true)
    console.log(paymentMethod)

    if (!stripe || !elements || !cart) {
      setSubmitting(false)
      return
    }

    setSubmitting(false)

    // const { error } = await stripe.confirmPayment({
    //   elements,
    //   confirmParams: {
    //     return_url: "if_required",
    //     payment_method_data: {
    //       billing_details: {
    //         name:
    //           cart.billing_address.first_name +
    //           " " +
    //           cart.billing_address.last_name,
    //         address: {
    //           city: cart.billing_address.city ?? undefined,
    //           country: cart.billing_address.country_code ?? undefined,
    //           line1: cart.billing_address.address_1 ?? undefined,
    //           line2: cart.billing_address.address_2 ?? undefined,
    //           postal_code: cart.billing_address.postal_code ?? undefined,
    //           state: cart.billing_address.province ?? undefined,
    //         },
    //         email: cart.email,
    //         phone: cart.billing_address.phone ?? undefined,
    //       },
    //     },
    //   },
    // })

    // if (error) setErrorMessage(error.message || "Erro ao processar o pagamento")

    // stripe
    //   .retrievePaymentIntent(session.data.client_secret as string)
    //   .then(({ paymentIntent }) => {
    //     switch (paymentIntent?.status) {
    //       case "succeeded":
    //         onPaymentCompleted()
    //         break
    //       case "requires_capture":
    //         onPaymentCompleted()
    //         break
    //       case "requires_payment_method":
    //         setErrorMessage(
    //           "Your payment was not successful, please try again."
    //         )
    //         break
    //       default:
    //         setErrorMessage("Something went wrong.")
    //         break
    //     }
    //   })

    // await stripe
    //   .confirmCardPayment(session.data.client_secret as string, {
    //     payment_method: {
    //       card: card,
    //       billing_details: {
    //         name:
    //           cart.billing_address.first_name +
    //           " " +
    //           cart.billing_address.last_name,
    //         address: {
    //           city: cart.billing_address.city ?? undefined,
    //           country: cart.billing_address.country_code ?? undefined,
    //           line1: cart.billing_address.address_1 ?? undefined,
    //           line2: cart.billing_address.address_2 ?? undefined,
    //           postal_code: cart.billing_address.postal_code ?? undefined,
    //           state: cart.billing_address.province ?? undefined,
    //         },
    //         email: cart.email,
    //         phone: cart.billing_address.phone ?? undefined,
    //       },
    //     },
    //   })
    //   .then(({ error, paymentIntent }) => {
    //     if (error) {
    //       const pi = error.payment_intent

    //       if (
    //         (pi && pi.status === "requires_capture") ||
    //         (pi && pi.status === "succeeded")
    //       ) {
    //         onPaymentCompleted()
    //       }

    //       setErrorMessage(error.message || null)
    //       return
    //     }

    //     if (
    //       (paymentIntent && paymentIntent.status === "requires_capture") ||
    //       paymentIntent.status === "succeeded"
    //     ) {
    //       return onPaymentCompleted()
    //     }

    //     return
    //   })
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
