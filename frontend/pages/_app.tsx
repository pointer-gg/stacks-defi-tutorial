import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import { StakeCard } from '@/components/StakeCard'
import { Connect } from '@stacks/connect-react'
import { useEffect, useState } from 'react'
import { userSession } from '@/components/ConnectWallet'

function MyApp({ Component, pageProps }: AppProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return (
    <Connect
      authOptions={{
        appDetails: {
          name: 'Stacks Next.js Template',
          icon: window.location.origin + '/logo.png',
        },
        redirectTo: '/',
        onFinish: () => {
          window.location.reload()
        },
        userSession,
      }}
    >
      <Layout userSession={userSession}>
        <Component {...pageProps} />
      </Layout>
    </Connect>
  )
}

export default MyApp
