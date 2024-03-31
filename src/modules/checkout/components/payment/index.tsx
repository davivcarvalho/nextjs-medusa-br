"use client"

import { useCallback, useContext, useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import ErrorMessage from "@modules/checkout/components/error-message"
import { Cart } from "@medusajs/medusa"
import { CheckCircleSolid, CreditCard } from "@medusajs/icons"
import { Button, Heading, Text, clx } from "@medusajs/ui"
import { PaymentElement } from "@stripe/react-stripe-js"
import { StripePaymentElementChangeEvent } from "@stripe/stripe-js"
import { FaRegNewspaper } from "react-icons/fa6"

import Divider from "@modules/common/components/divider"
import Spinner from "@modules/common/icons/spinner"
import {
  StripeContext,
  useStripeContext,
} from "@modules/checkout/components/payment-wrapper"

const Payment = ({
  cart,
}: {
  cart: Omit<Cart, "refundable_amount" | "refunded_total"> | null
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)
  const { paymentMethod, setPaymentMethod } = useStripeContext()

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "payment"

  const isStripe = cart?.payment_session?.provider_id === "stripe"
  const stripeReady = useContext(StripeContext)

  const paymentReady =
    cart?.payment_session && cart?.shipping_methods.length !== 0

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const handleEdit = () => {
    router.push(pathname + "?" + createQueryString("step", "payment"), {
      scroll: false,
    })
  }

  const handleSubmit = () => {
    setIsLoading(true)
    router.push(pathname + "?" + createQueryString("step", "review"), {
      scroll: false,
    })
  }

  const handlePaymentChange = (e: StripePaymentElementChangeEvent) => {
    if (!e.complete) setPaymentMethod(null)
    if ((e.value.type === "boleto" || e.value.type === "card") && e.complete)
      setPaymentMethod(e.value.type)

    setCardComplete(e.complete)
  }

  useEffect(() => {
    setIsLoading(false)
    setError(null)
  }, [isOpen])

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none":
                !isOpen && !paymentReady,
            }
          )}
        >
          Pagamento
          {!isOpen && paymentReady && <CheckCircleSolid />}
        </Heading>
        {!isOpen && paymentReady && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
            >
              Editar
            </button>
          </Text>
        )}
      </div>
      <div>
        {cart?.payment_sessions?.length ? (
          <div className={isOpen ? "block" : "hidden"}>
            {isStripe && stripeReady && (
              <div className="mt-5 transition-all duration-150 ease-in-out">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Digite os dados do seu cartão:
                </Text>
                <PaymentElement
                  options={{
                    fields: { billingDetails: "never" },
                  }}
                  onChange={handlePaymentChange}
                />
              </div>
            )}

            <ErrorMessage error={error} />

            <Button
              size="large"
              className="mt-6"
              onClick={handleSubmit}
              isLoading={isLoading}
              disabled={(isStripe && !cardComplete) || !cart.payment_session}
            >
              Continuar para a revisão
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-4 py-16 text-ui-fg-base">
            <Spinner />
          </div>
        )}

        <div className={isOpen ? "hidden" : "block"}>
          {cart && paymentReady && cart.payment_session && (
            <div className="flex items-start gap-x-1 w-full">
              <div className="flex flex-col ">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Método de pagamento
                </Text>
                <div className="flex items-center h-7 w-fit gap-3">
                  <Text className="txt-medium text-ui-fg-subtle">
                    {paymentMethod === "card"
                      ? "Cartão de Crédito"
                      : paymentMethod === "boleto"
                        ? "Boleto Bancário"
                        : "Método de pagamento não selecionado"}
                  </Text>

                  {paymentMethod === "card" ? (
                    <CreditCard />
                  ) : paymentMethod === "boleto" ? (
                    <FaRegNewspaper />
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Divider className="mt-8" />
    </div>
  )
}

export default Payment
