export default class Routes {
    static config($stateProvider) {
        $stateProvider.state('home', {
            url: '/',
            component: 'home'
        }).state('login', {
            url: '/login',
            component: 'login'
        });
    }
}