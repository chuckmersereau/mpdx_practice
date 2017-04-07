class ValidationToolsSidebarController {
    constructor(
        $state
    ) {
        this.$state = $state;
    }

    $onInit() {
        this.fixPhone.loadCount();
        this.fixEmailAddress.loadCount();
        this.fixMailingAddress.loadCount();
    }
}

const ValidationToolsSidebar = {
    controller: ValidationToolsSidebarController,
    template: require('./validationToolsSidebar.html'),
    bindings: {
        fixPhone: '=',
        fixEmailAddress: '=',
        fixMailingAddress: '='
    }
};

export default angular.module('mpdx.tools.validationToolsSidebar.component', [])
    .component('validationToolsSidebar', ValidationToolsSidebar).name;