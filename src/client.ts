/* eslint-disable no-unused-vars */
/* eslint-disable no-var */
import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient // This must be a `var` and not a `let / const`
}

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({ log: ['query'] })
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({ log: ['query'] })
  }
  prisma = global.prisma
}

export default prisma
