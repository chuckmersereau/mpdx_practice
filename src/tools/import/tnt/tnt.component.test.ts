import component from './tnt.component';

describe('tools.import.tnt.component', () => {
    let rootScope, scope, $ctrl, contactsTags, Upload, alerts, gettextCatalog, q;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _contactsTags_, _Upload_, _alerts_, _gettextCatalog_, $q) => {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            contactsTags = _contactsTags_;
            Upload = _Upload_;
            alerts = _alerts_;
            q = $q;
            gettextCatalog = _gettextCatalog_;
            $ctrl = $componentController('importTnt', { $scope: scope }, {});
        });
        spyOn(alerts, 'addAlert').and.callFake((data) => data);
        spyOn(gettextCatalog, 'getString').and.callThrough();
    });

    describe('events', () => {
        it('should handle account list change', () => {
            spyOn(contactsTags, 'load').and.callFake(() => {});
            rootScope.$emit('accountListUpdated');
            rootScope.$digest();
            expect(contactsTags.load).toHaveBeenCalled();
        });
    });

    describe('save', () => {
        it('should handle errors', () => {
            spyOn(Upload, 'upload').and.callFake(() => q.reject());
            $ctrl.save({}).catch(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'danger');
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
            });
        });
    });
});