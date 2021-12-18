import type { MetaFunction, LoaderFunction } from 'remix'
import type { User, Url } from '@prisma/client'

import { useLoaderData } from 'remix'

import { db } from '~/utils/db.server'

const USER_ID = 1

type UserData = User | null
type UrlsData = Url[] | null
type LoaderData = {
  urls: UrlsData
  user: UserData
}

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  return {
    urls: await db.url.findMany(),
    user: await db.user.findUnique({
      where: { id: USER_ID },
    }),
  }
}

export const meta: MetaFunction = () => {
  return {
    title: 'Url Shortener',
    description: 'Generate and save short urls to share',
  }
}

export default function Index() {
  const data = useLoaderData<LoaderData>()

  return (
    <main>
      <ul>
        {data.urls?.length ? (
          data.urls.map((url) => {
            return <li>{url.shortUrl}</li>
          })
        ) : (
          <li>No Urls</li>
        )}
      </ul>
    </main>
  )
}
