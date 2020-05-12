import App from 'next/app'
import { ApolloProvider } from '@apollo/client'
import withApollo from '../lib/withApollo'
import '../styles/tailwind.css'
import Page from '../components/Page'
import { ColorThemeProvider } from '../context/ColorContext'

class MyApp extends App {
  static async getInitialProps ({ Component, ctx }) {
    let pageProps = {}
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }
    // this exposes the query to the user
    pageProps.query = ctx.query
    return { pageProps }
  }

  render () {
    const { Component, apollo, pageProps } = this.props
    return (
      <ApolloProvider client={apollo}>
        <ColorThemeProvider>
          <Page>
            <Component {...pageProps} />
          </Page>
        </ColorThemeProvider>
      </ApolloProvider>
    )
  }
}

export default withApollo(MyApp)
