'use client'

import { createContext } from 'react'
import { Session, User } from 'lucia'

export interface SessionContext {
	user: User
	session: Session
}

const SessionContext = createContext<SessionContext | null>(null)
export default SessionContext
