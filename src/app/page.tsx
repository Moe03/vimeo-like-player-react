import Player from './PlayerUI/Player';

export default function Home() {
  return (
    <main className="flex flex-col gap-10 min-h-screen">
      <div className='text-center p-24 pb-5'>
        <h1 className='font-bold text-2xl'>React Vimeo Like Player</h1>
        <p>Open source, built with NextJS, TailwindCSS, NextUI and Framer motion</p>
      </div>
      <div className='w-[90%] md:w-[50%] mx-auto'>
        <div className="relative pb-[56.25%] mx-auto">
          <div className="absolute inset-0">
            <Player src='/sample2.mp4' thumbnailURL='' />
          </div>
        </div>
      </div>
     

    </main>
  )
}
