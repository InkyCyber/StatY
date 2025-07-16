import Head from 'next/head'
import { useState } from 'react'

export default function Home() {
  const [count, setCount] = useState(0)
  return (
    <>
      <Head>
        <title>StatY</title>
      </Head>
      <main>
        <h1>Hello StatY!</h1>
        <p>Count: {count}</p>
        <button onClick={() => setCount(count + 1)}>Increment</button>
      </main>
    </>
  )
}
