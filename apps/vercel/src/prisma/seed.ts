import prisma from "../lib/prisma"

async function main() {
  const response = await Promise.all([
    prisma.tests.upsert({
      create: {
        title: "Hello, Prisma!",
        description: "Test record"
      }
    })
  ])
  console.log(response)
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
