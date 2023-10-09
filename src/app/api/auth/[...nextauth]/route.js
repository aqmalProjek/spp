import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import supabase from "@/app/utils/supabase";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                username: {label : 'username', type: "text"},
                password: {label: "password",type : "password"},
                password1: {label: "password1",type : "password"},
            },
            async authorize(credentials,req) {

               console.log(credentials);
               if(credentials.username === "" || credentials.password === "") {
                   console.log('gagal');
                   return null;
               }

               const res = await supabase.from('pengguna').select()
               .eq('username',credentials.username).single()
               
               console.log(res);
               let user = res.data

               if(!user) {
                   console.log('gagal temukan user');
                   return null;
               }

               console.log('user',user);

               //cek password valid
               if (user.password !== credentials.password) {
                    return null
               }
               user = {
                   name : user.username,
                   email : user.username,
                   image : 'asdasdasd',
                   role: user.role
               }
               return user;
            }
        })
    ],
    pages : {
        signIn : '/'
    },
    session: {
        strategy : "jwt",
    },
    callbacks: {
       
        async session({ session, user, token }) {
          const {data : newUser} = await supabase.from('pengguna').select().eq('username',token.name).single();

          session.user.role = newUser.role
          session.user.id = newUser.id
          session.user.nis = newUser.nis

          return session
        },
    },
    secret : process.env.NEXTAUTH_SECRET,
    debug : process.env.NODE_ENV === 'development'
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST}