import { getSession } from 'next-auth/react'
import { getServerSession } from "next-auth/next"
import { options as authOptions } from "../auth/[...nextauth]";
import prisma from "../../../lib/prisma"

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req, res) {
  const { title, content } = req.body
  console.log("HOGEHOGE1")

  // const session = await getSession({ req })
  const session: any = await getServerSession(req, res, authOptions);
  console.log("HOGEHOGE2")
  console.log(`HOGE\nemail:${session?.user?.email}`)
  console.log(session)
  console.log(`user: ${session?.user}`)

  const result = await prisma.post.create({
    data: {
      title: title,
      content: content,
      // author: { connect: { email: session?.user?.email } },
      author: { connect: { email: "mitsuyoshi.tsukuba@gmail.com" } },
    },
  })
  res.json(result)
}
