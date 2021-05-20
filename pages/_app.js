import { RecoilRoot } from 'recoil';
import Head from 'next/head';

import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
    <Head>
      <title>meed</title>
    </Head>
    <RecoilRoot>
      <Component {...pageProps} />
    </RecoilRoot>
    </>
  )
}

export default MyApp
