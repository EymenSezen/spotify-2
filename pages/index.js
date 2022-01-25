import Head from 'next/head'
import Sidebar from '../components/Sidebar'
import Center from '../components/Center'
import Player from '../components/Player'
import { getSession } from 'next-auth/react'
export default function Home() {
  return (
    // flex flex-col items-center justify-center min-h-screen py-2
    <div className="bg-black h-screen overflow">
      <Head>
        <title>Spotify</title>
        <link rel="icon" href="https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/2048px-Spotify_logo_without_text.svg.png" />
      </Head>
      <main className='flex'>
        <Sidebar/>
        <Center/>
      </main>
      <div className='sticky bottom-0'>
        <Player/>
      </div>
    </div>
  )
}
export async function getServerSideProps(context){
  const session=await getSession(context);
  return {
    props:{
      session
    }
  }

}
