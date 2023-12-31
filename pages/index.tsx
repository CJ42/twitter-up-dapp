import Head from 'next/head'

export default function Home() {
  return (
    <div className="mt-4 max-w-xs p-4 md:max-w-md lg:max-w-2xl xl:max-w-4xl mx-auto">
      <Head>
        <title>Import your Twitter Profile on your UP</title>
        <meta name="description" content="Next Twitter Starter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="mt-10">
        <h1 className="text-3xl font-bold">
          Import your Twitter Profile on your UP.
        </h1>

        <a href="/twitter" className="flex items-center p-8 mt-8 border rounded-md space-x-4 hover:bg-gray-100">
          <p className="font-semibold text-lg">Let's get Started &rarr;</p>
        </a>
{/* 
        <div className="p-8 mt-8 border rounded-md space-y-4">
        <div>
            <p className="font-semibold text-lg">LSP3 Profile Metadata</p>
            <p>
              This is what the JSON under your 
              <code className="">LSP3Profile</code> 
              metadata looks like now
            </p>
          </div>
          <pre>
            "some text"
          </pre>
        </div> */}

        {/* <div className="p-8 mt-8 border rounded-md space-y-4">
          <div>
            <p className="font-semibold text-lg">Pages</p>
            <p>
              Get started by editing{' '}
              <code className="">pages/index.js</code>
            </p>
          </div>
          <div>
            <p className="font-semibold text-lg">API</p>
            <p>
              Get started with Twitter API by looking at{' '}
              <code className="">pages/api/twitter-user.js</code>
            </p>
          </div>
        </div> */}

        {/* <div className="flex mt-8 flex-wrap gap-4">
          <a href="https://nextjs.org/docs" className="flex-auto border rounded-md px-4 py-6 hover:bg-gray-100">
            <h2 className="font-semibold text-lg">Next.js Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://github.com/draftbit/twitter-lite" className="flex-auto border rounded-md px-4 py-6 hover:bg-gray-100">
            <h2 className="font-semibold text-lg">Twitter-lite Documentation &rarr;</h2>
            <p>Find Twitter-lite documentation.</p>
          </a>

          <a href="https://tailwindcss.com/docs" className="flex-auto border rounded-md px-4 py-6 hover:bg-gray-100">
            <h2 className="font-semibold text-lg">Tailwindcss Documentation &rarr;</h2>
            <p>Find in-depth information about Tailwindcss features.</p>
          </a>

          <a href="https://developer.twitter.com/en/docs/twitter-api/v1" className="flex-auto border rounded-md px-4 py-6 hover:bg-gray-100">
            <h2 className="font-semibold text-lg">Twitter API Documentation &rarr;</h2>
            <p>Checkout Twitter API documentation.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className="flex-auto border rounded-md px-4 py-6 hover:bg-gray-100"
          >
            <h2 className="font-semibold text-lg">Deploy &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div> */}
      </main>
    </div>
  )
}
