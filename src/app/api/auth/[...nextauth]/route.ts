import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Password",
      credentials: {
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Simple password check - set ADMIN_PASSWORD in your environment
        const adminPassword = process.env.ADMIN_PASSWORD || "carys123";
        
        if (credentials?.password === adminPassword) {
          return { id: "1", name: "Carys", email: "carys@comics.local" };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "dev-secret-change-in-production",
});

export { handler as GET, handler as POST };
