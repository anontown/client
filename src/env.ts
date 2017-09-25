declare var __PROD__: boolean;

export const Config = __PROD__ ?
    {
        client: {
            origin: 'https://anontown.com'
        },
        camo: {
            origin: 'https://camo.anontown.com',
            key: '0x24FEEDFACEDEADBEEFCAFE'
        },
        api: {
            origin: 'https://api.anontown.com'
        },
        socket: {
            origin: 'wss://api.anontown.com'
        },
        recaptcha: {
            siteKey: '6LdoFBQUAAAAACc3lhPhbkEANEAHsmNd6UDN2vKo'
        }
    }
    :
    {
        client: {
            origin: 'http://localhost:3000'
        },
        camo: {
            origin: 'https://camo.anontown.com',
            key: '0x24FEEDFACEDEADBEEFCAFE'
        },
        api: {
            origin: 'http://localhost:8080'
        },
        socket: {
            origin: 'ws://localhost:8080'
        },
        recaptcha: {
            siteKey: '6LeoFBQUAAAAAB0fiXvXvaBO9VyFC7igegEOlD7a'
        }
    };