export default {
    'env': 'development',
    'apiUrl': 'http://api.lvh.me:3000/api/v2/',
    'baseUrl': 'http://api.lvh.me:8080/',
    'authUrl': 'https://thekey.me/cas/',
    'authLoginPath': 'login?client_id=4027334344069527005&scope=fullticket&response_type=token&redirect_uri=http://localhost:8080/auth',
    'authSignupPath': 'service/selfservice?target=signup&client_id=4027334344069527005&scope=fullticket&response_type=token&redirect_uri=http://localhost:8080/auth',
    'authLogout': 'logout?service=http://localhost:8080/login',
    'oAuthUrl': 'http://auth.lvh.me:3000/auth/user/'
};
