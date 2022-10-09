import React from 'react';
import Document, {Head, Html, Main, NextScript } from 'next/document';
import createEmotionServer from '@emotion/server/create-instance';
import createCache from '@emotion/cache'
import { style } from '@mui/system';

export default class MyDocument extends Document {
    render (){
        return (
            <Html lang='en'>
                <Head>
                    <link ref="stylesheet"
                    
                    href="https://fonts.googleapis.com/css?family=Roboto:300,600,500,700&display=swap"
                    />
                </Head>
                <body>
                    <Main/>
                    <NextScript/>
                </body>
            </Html>
        );
    }
}

MyDocument.getInitialProps = async (ctx) => {
    const originalRenderPage = ctx.renderPage;
    const cache = createCache({ key: 'css'});
    const { extractCriticalToChunks } = createEmotionServer(cache);
    ctx.renderPage = () => 
        originalRenderPage({
            enhanceApp: (App) => (props) => <App emotionCach={cache} {...props}/>,
        });
        const initialProps = await Document.getInitialProps(ctx);
        const emotionStyles = extractCriticalToChunks(initialProps.html);
        const  emotionStyleTags = emotionStyles.styles.map((style) => {
        <style
        data-emotion={`${style.key} ${style.ids.join(' ')}`}
        key={style.key}
        dangerouslySetInnerHTML={{__html: style.css}}
        />
        });
        return {
            ...initialProps,
            styles: [
                ...React.Children.toArray(initialProps.styles),
                ...emotionStyleTags,
            ],
        };
};