'use client'

import { type PropsWithChildren } from 'react'
import { SessionContext, type SessionContextProps } from '@/contexts'

const SessionProvider = ({ children, ...props }: PropsWithChildren<{ value: SessionContextProps }>) => {
	return <SessionContext.Provider {...props}>{children}</SessionContext.Provider>
}

export default SessionProvider
