export default class Routes {
	static config($stateProvider) {
		$stateProvider.state('home', {
			url: '/',
			component: 'home',
			open: true
		});
	}
}