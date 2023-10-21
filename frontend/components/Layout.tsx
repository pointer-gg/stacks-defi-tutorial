import { PropsWithChildren } from 'react'
import Footer from './Footer'
import Navbar from './Nav/Navbar'
import { StakeCard } from './StakeCard'

interface UserSession {
  userSession: any
}

import { userSession } from './ConnectWallet'

export default function Layout({ children }: PropsWithChildren<UserSession>) {
  return (
    <div className="flex min-h-screen flex-col gap-16">
      <Navbar />
      <main className="mb-auto">{children}</main>
      <Footer />
    </div>
  )
}
