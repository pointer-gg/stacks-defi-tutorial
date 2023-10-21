import { UserNav } from './Nav/UserNav'
import { Input } from './forms/input'
import { Button } from './ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/Card'

import { routeFetch } from '@/lib/fetch'
import { useEffect, useState } from 'react'
const route = async () => {
  try {
    const response = await fetch('/api/route')

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    console.log(data)
  } catch (error) {
    console.error('Error fetching the API route:', error)
  }
}

export const StakeCard = () => (
  <Card className="w-[350px]">
    <CardHeader>
      <CardTitle>Create</CardTitle>
      <CardDescription>Deploy</CardDescription>
    </CardHeader>
    <CardContent>
      <form>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            {/* <Label htmlFor="name">Name</Label> */}
            <Input id="name" placeholder="Name of your project" />
          </div>
          <div className="flex flex-col space-y-1.5"></div>
        </div>
      </form>
    </CardContent>
    <CardFooter className="flex justify-between">
      <Button>Stake</Button>
      <Button onClick={route}>Route test</Button>
      <ApiDataDisplay />
    </CardFooter>
  </Card>
)

const ApiDataDisplay = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/route')

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`)
        }

        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div>
      <h2>API Data:</h2>
      <ul>{JSON.stringify(data, null, 2)}</ul>
    </div>
  )
}

export default ApiDataDisplay
