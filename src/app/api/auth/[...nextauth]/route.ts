import NextAuth from "next-auth"
import { authOptions } from "../../../../../lib/auth"

// Ensure debug is disabled in authOptions if you want to remove the warning
const updatedAuthOptions = {
  ...authOptions,
  debug: false, // Add or override debug to false
}

const handler = NextAuth(updatedAuthOptions)

export { handler as GET, handler as POST }







// import NextAuth from "next-auth"
// import { authOptions } from "../../../../../lib/auth"

// const handler = NextAuth(authOptions)

// export { handler as GET, handler as POST }
