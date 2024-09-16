import { SessionContext } from '@/contexts'
import { useContext } from 'react'

const useSession = () => {
	const context = useContext(SessionContext)

	if (!context) {
		throw new Error('useSession must be used within a SessionProvider')
	}
	return context
}
export default useSession
