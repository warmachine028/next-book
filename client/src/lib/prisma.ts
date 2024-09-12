//? https://github.com/prisma/prisma/discussions/23533#discussioncomment-8838160
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool } from '@neondatabase/serverless'
import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'
import { withOptimize } from '@prisma/extension-optimize'
import { withPulse } from '@prisma/extension-pulse/node'

const neon = new Pool({ connectionString: process.env.DATABASE_PRISMA_URL }) // or process.env.POSTGRES_PRISMS_URL
const adapter = new PrismaNeon(neon)
const prismaClientSingleton = () =>
	new PrismaClient({ adapter })
		.$extends(withAccelerate())
		.$extends(
			withPulse({
				apiKey: process.env.PULSE_API_KEY as string
			})
		)
		.$extends(
			withOptimize({
				apiKey: process.env.OPTIMIZE_API_KEY as string
			})
		)

declare global {
	var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') {
	globalThis.prismaGlobal = prisma
}
