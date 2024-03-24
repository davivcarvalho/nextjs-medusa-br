import { Text } from "@medusajs/ui"
import { FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { IoIosMail } from "react-icons/io";


const MedusaCTA = () => {
  return (
    <Text className="flex gap-x-2 txt-compact-small-plus items-center">
      <a href="https://www.medusajs.com" target="_blank" rel="noreferrer">
        <FaInstagram size={20}/>
      </a>
      <a href="https://nextjs.org" target="_blank" rel="noreferrer">
        <FaWhatsapp size={20} />
      </a>
      <a href="https://nextjs.org" target="_blank" rel="noreferrer">
        <IoIosMail size={20} />
      </a>
    </Text>
  )
}

export default MedusaCTA
