import { PropsWithChildren } from 'react'
import Link from 'next/link'
import { UserNav } from './UserNav'

interface NavbarLinkProps {
  href: string
}

function NavbarLink({ href, children }: PropsWithChildren<NavbarLinkProps>) {
  return (
    <Link
      className="text-grey-darkest text-2xl hover:scale-105 hover:text-pink-600"
      href={href}
    >
      {children}
    </Link>
  )
}

export default function Navbar() {
  return (
    <nav className="flex h-10 w-full justify-center gap-4 px-4 pb-20 pt-4 font-sans md:px-20 ">
      <NavbarLink href="/">Home</NavbarLink>
      <NavbarLink href="/admin">Admin</NavbarLink>
      <NavbarLink href="/liquidity">Liquidity</NavbarLink>
      <NavbarLink href="/swap">Swap</NavbarLink>
      <UserNav />
    </nav>
  )
}
