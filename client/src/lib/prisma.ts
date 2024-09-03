//? https://github.com/prisma/prisma/discussions/23533#discussioncomment-8838160
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool } from '@neondatabase/serverless'
import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const neon = new Pool({ connectionString: process.env.POSTGRES_PRISMA_URL })
const adapter = new PrismaNeon(neon)
const prismaClientSingleton = () => new PrismaClient({ adapter }).$extends(withAccelerate())

declare global {
	var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') {
	globalThis.prismaGlobal = prisma
}
