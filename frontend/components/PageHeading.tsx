import { PropsWithChildren } from 'react'
import Image from 'next/image'
import logo from '../components/assets/logo.svg'
export default function PageHeading({ children }: PropsWithChildren<{}>) {
  return (
    <>
      <h1 className="self-center bg-gradient-to-r from-fuchsia-600 to-pink-600 bg-clip-text pb-8 text-8xl font-extrabold text-transparent">
        {children}
        <Image src={logo} alt="Haystack Logo" width={100} height={100} />
      </h1>
    </>
  )
}
