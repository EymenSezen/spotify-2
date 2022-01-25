import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import SpotifyWebApi from 'spotify-web-api-node/src/spotify-web-api';

const spotifyApi=new SpotifyWebApi(
    {
        clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
   //redirectUri: process.env.REDIRECT_URI,
    }
)

function useSpotify() {
  const {data :session,status}=useSession();
    useEffect(()=>{
        if(session){
            if(session.error==="RefreshAccessTokenError"){
            signIn();
        }
        spotifyApi.setAccessToken(session.user.accessToken); //buradaki tokenle hareket edeceğiz spotify api kullanırken o yüzden ona auth accestokenimizi veriyoruz
    }},[session]);
  return spotifyApi;
  
}

export default useSpotify;
