import Document, { Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render () {
    return (
      <html lang="en">
        <Head />
        <body className={'bg-pink-100 antialiased'}>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
