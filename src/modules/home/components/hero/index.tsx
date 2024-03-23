import Image from "next/image"

const Hero = () => {
  return (
    <div className="relative w-full pb-[67%] border-b border-ui-border-base bg-ui-bg-subtle">
      <Image src="/images/home-bg.jpg" 
        width={1024}
        height={1024}
        alt="Banner Image"
        className="absolute inset-0 object-cover"/>
    </div>
  )
}

export default Hero
