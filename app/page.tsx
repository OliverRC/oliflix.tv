import Image from 'next/image'

interface Link {
  name: string;
  url: string;
  logo: string;
  description: string;
}

export default function Home() {

  const links: Link[] = [{
    name: 'Plex',
    url: 'https://app.plex.tv/desktop',
    logo: '/plex-logo.svg',
    description: 'Where you watch stuff!'
  },
  {
    name: 'Overseerr',
    url: 'https://overseerr.oliflix.tv',
    logo: '/overseerr-logo.svg',
    description: 'Where you request stuff!'
  },
  {
    name: 'Radarr',
    url: 'https://radarr.oliflix.tv',
    logo: '/radarr-logo.png',
    description: 'Handles movie stuff!'
  },
  {
    name: 'Sonarr',
    url: 'https://sonarr.oliflix.tv',
    logo: '/sonarr-logo.svg',
    description: 'Handles series/tv/anime stuff!'
  },
  {
    name: 'Tautalli',
    url: 'https://tautulli.oliflix.tv',
    logo: '/tautulli-logo.svg',
    description: 'Monitoring plex server stuff!'
  }]

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

      <div className="text-5xl font-extrabold ...">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-600">
          The home of sweet sweet pixel goodness
        </span>
      </div>

      <div>
        <ul className="space-y-4">
          {links.map(link => {
            return (
              <li>
                <LinkElement link={link} />
              </li>
            )
          })}
        </ul>
      </div>

      <span>bye bye meow</span>
    </main>
  )
}



function LinkElement({ link }: { link: Link }) {
  return (
    <div className="grid grid-cols-2 px-6 py-4 bg-indigo-700/20 rounded-lg space-x-6 hover:bg-indigo-700/30 transition duration-500 hover:scale-105 transform items-center">
      <div className='justify-self-center'>
        <Image src={link.logo} alt={link.name} width={200} height={100} className='w-auto h-12' />
      </div>
      <div className='justify-self-end flex'>
        <span className="text-sm text-indigo-200 pl-12 pr-4">{link.description}</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 stroke-indigo-300/60">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
      </div>
    </div>
  )
}