import { StakeCard } from '@/components/StakeCard'
import PageHeading from '../components/PageHeading'

import { WalletLinkDialog } from '@/components/WalletLinkDialog'

import Image from 'next/image'
import logo from '../components/assets/logo.svg'
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-2">
      <PageHeading>HayStack</PageHeading>
      <div>
        <WalletLinkDialog />
        <StakeCard />
      </div>
    </div>
  )
}
