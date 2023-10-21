import { createContext, useContext } from 'react'

export const UserSessionContext = createContext(null)

import { useState, useEffect } from 'react'

export function useUserSession() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return { isClient }
}
