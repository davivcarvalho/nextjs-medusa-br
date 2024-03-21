import Image from "next/image"

const Hero = () => {
  return (
    <div className="h-2/6 w-full border-b border-ui-border-base bg-ui-bg-subtle flex justify-center">
      <Image src={require('../../../../../public/home-bg.jpg')} width={1024} height={1024} className="flex items-center justify-center" alt=""/>

    </div>
  )
}

export default Hero
