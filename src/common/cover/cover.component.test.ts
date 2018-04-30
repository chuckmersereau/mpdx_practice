import component from './cover.component';

describe('common.cover.component', () => {
    let $ctrl, rootScope, scope, componentController;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            componentController = $componentController;
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('cover', { $scope: scope }, {});
    }

    it('should define covers', () => {
        expect($ctrl.covers).toEqual([
            {
                'url': require('./images/splash_sf.jpg'),
                'copyright': 'San Francisco, California'
            }, {
                'url': require('./images/splash_machu.jpg'),
                'copyright': 'Machu Picchu, Peru'
            }, {
                'url': require('./images/splash_china.jpg'),
                'copyright': 'Guilin, China'
            }
        ]);
    });
    it('should pick a random cover', () => {
        expect($ctrl.cover.url).toBeDefined();
        expect($ctrl.cover.copyright).toBeDefined();
    });
});