export default {
    'env': 'development',
    'apiUrl': 'https://api.stage.mpdx.org/api/v2/',
    'baseUrl': 'http://localhost:8080/',
    'authUrl': 'https://stage.thekey.me/cas/',
    'authLoginPath': 'login?client_id=4027334344069527005&scope=fullticket&response_type=token&redirect_uri=http://localhost:8080/auth',
    'authSignupPath': 'service/selfservice?target=signup&client_id=4027334344069527005&scope=fullticket&response_type=token&redirect_uri=http://localhost:8080/auth',
    'authLogout': 'logout?service=http://localhost:8080/login',
    'oAuthUrl': 'https://auth.stage.mpdx.org/auth/user/'
};
