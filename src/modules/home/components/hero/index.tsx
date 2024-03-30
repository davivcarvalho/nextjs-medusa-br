import Image from "next/image"

const Hero = () => {
  return (
    <div className="w-full border-b border-ui-border-base bg-ui-bg-subtle">
      <Image
        src="/images/home-bg.jpg"
        width={2048}
        height={1024}
        alt="Banner Image"
        className="max-h-96 inset-0 object-cover"
      />
    </div>
  )
}

export default Hero
