let APIURL = '';

switch (window.location.hostname) {
    case 'localhost' || '127.0.0.1':
        APIURL = 'http://localhost:4321';
        break;
    case 'sgp-level-up-client.herokuapp.com':
        APIURL = 'https://sgp-level-up-server.herokuapp.com'
        // APIURL = 'http://localhost:4321';
}

export default APIURL;