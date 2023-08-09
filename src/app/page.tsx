import Player from './PlayerUI/Player';

export default function Home() {
  return (
    <main className="flex flex-col gap-10 min-h-screen  p-24">
      <div className='text-center'>
        <h1 className='font-bold text-2xl'>React Vimeo Like Player</h1>
        <p>Open source, built with NextJS, TailwindCSS, NextUI and Framer motion</p>
      </div>
      <div className='w-[50%] mx-auto'>
        <Player src='/sample2.mp4' thumbnailURL='' />
      </div>
    </main>
  )
}
