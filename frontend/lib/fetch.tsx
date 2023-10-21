type ApiResponse = {
  id: number
  name: string
  description: string
}

export const routeFetch = async () => {
  try {
    const response = await fetch('/api/route')
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data: ApiResponse = await response.json()
    console.log(data)
  } catch (error) {
    console.error(
      'There was a problem with the fetch operation:',
      error.message
    )
  }
}
