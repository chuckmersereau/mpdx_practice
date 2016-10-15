class menuController {
    path;
    constructor($rootScope, $location, $state) {
        this.state = $state;
        this.path = $location.path();

        $rootScope.$watch(() => {
            return $location.path();
        }, () => {
            this.path = $location.path();
        });
    }
}

const menuComponent = {
    controller: menuController,
    controllerAs: 'vm',
    template: require('./menu.html')
};

export default angular.module('mpdx.menu', [])
    .component('menu', menuComponent).name;
