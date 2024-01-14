import { NextApiHandler } from 'next';
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GitHubProvider from 'next-auth/providers/github';
import prisma from '../../../lib/prisma';
// import { AdapterUser } from 'next-auth/adapters';

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;

export const options = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,
  // callbacks: {
  //   // セッションを設定するコールバック
  //   async session(params: { session: Session, token: any, user: AdapterUser }) {
  //     // セッションにユーザー情報を追加する例
  //     params.session.user = params.user
  //     return params.session
  //   },
  //   // ユーザーをデータベースから取得するコールバック
  //   async signIn(params: any) {
  //     // ユーザー情報をデータベースから取得する処理を追加する例
  //     return true
  //   },
  //   // ユーザーサインアウト時の処理をカスタマイズするコールバック
  //   async signOut() {
  //     // サインアウト時のカスタム処理を追加する例
  //     return true
  //   },
  //   // セッション更新時の処理をカスタマイズするコールバック
  //   async sessionUpdate(session, user) {
  //     // セッション更新時のカスタム処理を追加する例
  //     return true
  //   },
  // },
};