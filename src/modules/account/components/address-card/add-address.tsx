"use client"

import { Region } from "@medusajs/medusa"
import { Plus } from "@medusajs/icons"
import { Button, Heading } from "@medusajs/ui"
import { useEffect, useState } from "react"
import { useFormState } from "react-dom"

import useToggleState from "@lib/hooks/use-toggle-state"
import CountrySelect from "@modules/checkout/components/country-select"
import Input from "@modules/common/components/input"
import Modal from "@modules/common/components/modal"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import { addCustomerShippingAddress } from "@modules/account/actions"

const AddAddress = ({ region }: { region: Region }) => {
  const [successState, setSuccessState] = useState(false)
  const { state, open, close: closeModal } = useToggleState(false)

  const [formState, formAction] = useFormState(addCustomerShippingAddress, {
    success: false,
    error: null,
  })

  const close = () => {
    setSuccessState(false)
    closeModal()
  }

  useEffect(() => {
    if (successState) {
      close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successState])

  useEffect(() => {
    if (formState.success) {
      setSuccessState(true)
    }
  }, [formState])

  return (
    <>
      <button
        className="border border-ui-border-base rounded-rounded p-5 max-h-[250px] max-w-[150px] flex flex-col justify-center items-center"
        onClick={open}
      >
        <span className="text-base-semi mb-2">Novo endereço</span>
        <Plus />
      </button>

      <Modal isOpen={state} close={close}>
        <Modal.Title>
          <Heading>Adicionar Endereço</Heading>
        </Modal.Title>
        <form action={formAction}>
          <Modal.Body>
            <div className="flex flex-col gap-y-2">
              <div className="grid grid-cols-2 gap-x-2">
                <Input
                  label="Nome"
                  name="first_name"
                  required
                  autoComplete="given-name"
                />
                <Input
                  label="Sobrenome"
                  name="last_name"
                  required
                  autoComplete="family-name"
                />
              </div>
              <Input
                label="Endereço"
                name="address_1"
                required
                autoComplete="address-line1"
              />
              <Input
                label="Complemento: Apto, casa, etc."
                name="address_2"
                autoComplete="address-line2"
              />
              <div className="grid grid-cols-[144px_1fr] gap-x-2">
                <Input
                  label="CEP"
                  name="postal_code"
                  required
                  autoComplete="postal-code"
                />
                <Input
                  label="Cidade"
                  name="city"
                  required
                  autoComplete="locality"
                />
              </div>
              <Input
                label="Estado"
                name="province"
                autoComplete="address-level1"
              />
              <CountrySelect
                region={region}
                name="country_code"
                required
                autoComplete="country"
              />
              <Input label="Telefone" name="phone" autoComplete="phone" />
            </div>
            {formState.error && (
              <div className="text-rose-500 text-small-regular py-2">
                {formState.error}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <div className="flex gap-3 mt-6">
              <Button
                type="reset"
                variant="secondary"
                onClick={close}
                className="h-10"
              >
                Cancelar
              </Button>
              <SubmitButton>Salvar</SubmitButton>
            </div>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  )
}

export default AddAddress
