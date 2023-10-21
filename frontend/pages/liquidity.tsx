import { StakeCard } from '@/components/StakeCard'
import PageHeading from '../components/PageHeading'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-start justify-center py-2">
      <PageHeading>My Exchange</PageHeading>
      <div>
        <StakeCard />
      </div>
    </div>
  )
}
