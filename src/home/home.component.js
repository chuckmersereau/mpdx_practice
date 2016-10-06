class HomeController {
	constructor() {
		this.welcomeMessage = 'Hello World';
	}
}
const Home = {
	template: require('./home.html'),
	controller: HomeController
};

export default angular.module('mpdx.home', [])
	.component('home', Home)
	.name;