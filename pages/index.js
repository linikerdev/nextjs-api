import Head from 'next/head'
import { useEffect } from 'react'
import styles from '../styles/Home.module.css'

export default function Home({ user }) {

  useEffect(() => {
    console.log('chamando teste')
  }, [])


  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>

        </h1>
        <ul>
          {user.map((u, i) => (
            <li key={i}>{u.name}</li>
          ))}
        </ul>

      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}


export async function getStaticProps() {
  // Call an external API endpoint to get posts
  const res = await fetch('http://localhost:3000/api/user')
  const user = await res.json()

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      user,
    },
  }
}