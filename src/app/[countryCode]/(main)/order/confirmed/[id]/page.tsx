import { Metadata } from "next"

import { completeCart, retrieveOrderByCartId } from "@lib/data"
import { LineItem, Order } from "@medusajs/medusa"
import { enrichLineItems } from "@modules/cart/actions"
import OrderCompletedTemplate from "@modules/order/templates/order-completed-template"
import { notFound } from "next/navigation"
import { revalidateTag } from "next/cache"

type Props = {
  params: { id: string }
}

export const metadata: Metadata = {
  title: "Pedido confirmado",
  description: "Seu pedido foi efetuado com sucesso",
}

export default async function OrderConfirmedPage({ params }: Props) {
  const { order } = await getOrder(params.id)

  async function getOrder(cartId: string) {
    const cart = await completeCart(cartId)
    revalidateTag("cart")

    try {
      const order = await retrieveOrderByCartId(cartId)

      if (!order) {
        return notFound()
      }

      const enrichedItems = await enrichLineItems(order.items, order.region_id)
      return {
        order: {
          ...order,
          items: enrichedItems as LineItem[],
        } as Order,
      }
    } catch (error) {
      return notFound()
    }
  }

  return <OrderCompletedTemplate order={order} />
}
