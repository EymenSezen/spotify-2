import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"   //i changed this
// import { refreshAccessToken } from "spotify-web-api-node/src/server-methods"
import spotifyApi,{ LOGIN_URL } from "../../../lib/spotify"


//bizim işimiz token almak ve bunu belli aralıklarla yenilemek bunu da biz nextauth ile yapıyoruz 
async function refreshAccessToken(token){

    try{
        spotifyApi.setAccessToken(token.accessToken);
        spotifyApi.setRefreshToken(token.refreshToken);
        const {body:refreshedToken}=await spotifyApi.refreshAccessToken();
        console.log("refreshed token is",refreshedToken)
        return {
            ...token,
            accessToken:refreshAccessToken.accessToken,
            accessTokenExpires:Date.now+refreshedToken.expires_in*1000,//=1 hour as 3600 returns from spotify api
            refreshedToken:refreshedToken.refresh_token??token.refreshToken, 
        }
   
    }
    catch{
        console.error(error)
        return{
            ...token,
            error:''
        };
    }
}
export default NextAuth({ //we use this object parameters in login
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization:LOGIN_URL,   //buradan geliyor import { LOGIN_URL } from "../../../lib/spotify"
    }),
    // ...add more providers here
  ],
  secret:process.env.JWT_SECRET,
  pages:{
      signIn:"/login"
  },
  callbacks:{
      async jwt({token,account,user})
      {
        //inital sign in  
        if(account &&user)
          {
              return{
                  ...token,
                  accessToken:account.access_token,
                  refreshToken:account.refresh_token,
                  username:account.providerAccountId,
                  accessTokenExpires:account.expires_at * 1000,//handling expiry times in milliseconsd hence *1000
              };
          }
          //return previous token if the access token hasnt expired yet
          if(Date.now()<token.accessTokenExpires){
              return token; //is still valid
          }
          //access token has expired,so we need to refresh it

          console.log("acces token has ecpired refreshing")
          return await refreshAccessToken(token)
        
      },
      async  session({session,token}){
          session.user.accessToken=token.accessToken;
          session.user.refreshToken=token.refreshToken;
          session.user.username=token.username;
          return session;
      }
  }
}) 