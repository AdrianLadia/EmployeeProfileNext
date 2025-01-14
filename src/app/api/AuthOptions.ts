import { NextAuthOptions } from "next-auth";
import GoogleProvider from 'next-auth/providers/google';

import ServerRequests from './ServerRequests';

import dotenv from 'dotenv'; 
dotenv.config(); 


const SECRET = process.env.SECRET !;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID !;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET !;


const serverRequests = new ServerRequests( );


export const authOption: NextAuthOptions = {
    session: {
        strategy: 'jwt',
    },
    providers: [
        GoogleProvider({
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async signIn({account, profile}){
            if (!profile?.email) {
                throw new Error('No Profile Found');
            }  
            if(account){

            }
            return true;
        },
        async jwt({ token, account, profile }) { 
            if(profile){
                const res = await serverRequests.firebaseLogin({profile}); 
    
                if (res.data) {
                    token.firebaseUserId = res.data._id;
                    token.roles = res.data.roles;
                    token.createdAt = res.data.createdAt;
                    token.isApproved = res.data.isApproved;
                    token.refreshToken = account?.refresh_token;
                    token.image = res.data.image; 
                }

            }

            return token;
        },

        async session({ session, token }) {
            if (token) {
                session.user._id = token.sub as string;
                session.user.createdAt = token.createdAt as string | Date;
                session.user.roles = token.roles as {
                    User: string[];
                    Memo: string[];
                    Employee: string[];
                    Offense: string[];
                };
                session.user.isApproved = token.isApproved as boolean | undefined;
                session.user.image = token.image as string;

                // delete (session.user as Partial<typeof session.user>).sensitiveInfo;
            } 

            return session; 
        }
    },
    secret: SECRET,
}