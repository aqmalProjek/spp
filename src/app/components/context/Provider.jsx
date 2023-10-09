'use client'
import React from 'react'

import { SessionProvider } from 'next-auth/react'

export default function Provider({children,session}) {
  return (
    <SessionProvider>
        {children}
    </SessionProvider>
  )
}
