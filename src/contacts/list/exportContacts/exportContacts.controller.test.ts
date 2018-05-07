import cntrl from './exportContacts.controller';

const filters = {
    any_tags: false
};

describe('contacts.list.exportContacts.controller', () => {
    let $ctrl, controller, alerts, api, contacts, scope, exportContacts, q, gettextCatalog;
    beforeEach(() => {
        angular.mock.module(cntrl);
        inject((
            $controller, $timeout, $rootScope, _contacts_, _alerts_, _api_, _exportContacts_, $q, _gettextCatalog_
        ) => {
            scope = $rootScope.$new();
            scope.$hide = () => {};
            alerts = _alerts_;
            api = _api_;
            contacts = _contacts_;
            exportContacts = _exportContacts_;
            q = $q;
            gettextCatalog = _gettextCatalog_;
            controller = $controller;
            $ctrl = loadController();
            spyOn(api, 'get').and.callFake(() => q.resolve(null));
        });
    });

    function loadController() {
        return controller('exportContactsController as $ctrl', {
            $scope: scope,
            selectedContactIds: [123, 456],
            filters: filters
        });
    }

    describe('constructor', () => {
        it('should set default filters', () => {
            expect($ctrl.filters).toEqual(filters);
        });
    });

    describe('exportMailingCSV', () => {
        beforeEach(() => {
            spyOn(exportContacts, 'create').and.callFake(() => q.resolve());
        });

        it('should call exportContacts.create', () => {
            $ctrl.exportMailingCSV();
            expect(exportContacts.create).toHaveBeenCalledWith($ctrl.filters, 'csv', true);
        });

        it('should return promise', () => {
            expect($ctrl.exportMailingCSV()).toEqual(jasmine.any(q));
        });

        describe('promise successful', () => {
            it('should call alerts.addAlert', (done) => {
                spyOn(alerts, 'addAlert').and.callThrough();
                spyOn(gettextCatalog, 'getString').and.callThrough();
                $ctrl.exportMailingCSV().then(() => {
                    expect(alerts.addAlert).toHaveBeenCalledWith(
                        'Mailing Addresses for contacts exported successfully as a CSV file'
                    );
                    done();
                });
                scope.$digest();
            });
            it('should call $scope.$hide', (done) => {
                spyOn(scope, '$hide').and.callThrough();
                $ctrl.exportMailingCSV().then(() => {
                    expect(scope.$hide).toHaveBeenCalled();
                    done();
                });
                scope.$digest();
            });
        });
    });

    describe('exportCSV', () => {
        beforeEach(() => {
            spyOn(exportContacts, 'create').and.callFake(() => q.resolve());
        });

        it('should call exportContacts.create', () => {
            $ctrl.exportCSV();
            expect(exportContacts.create).toHaveBeenCalledWith($ctrl.filters, 'csv');
        });

        describe('promise successful', () => {
            it('should call alerts.addAlert', (done) => {
                spyOn(alerts, 'addAlert').and.callThrough();
                spyOn(gettextCatalog, 'getString').and.callThrough();
                $ctrl.exportCSV().then(() => {
                    expect(alerts.addAlert).toHaveBeenCalledWith(
                        'Contacts exported successfully as a CSV file'
                    );
                    done();
                });
                scope.$digest();
            });

            it('should call $scope.$hide', (done) => {
                spyOn(scope, '$hide').and.callThrough();
                $ctrl.exportCSV().then(() => {
                    expect(scope.$hide).toHaveBeenCalled();
                    done();
                });
                scope.$digest();
            });
        });
    });

    describe('exportXLSX', () => {
        beforeEach(() => {
            spyOn(exportContacts, 'create').and.callFake(() => q.resolve());
        });

        it('should call exportContacts.create', () => {
            $ctrl.exportXLSX();
            expect(exportContacts.create).toHaveBeenCalledWith($ctrl.filters, 'xlsx');
        });

        describe('promise successful', () => {
            it('should call alerts.addAlert', (done) => {
                spyOn(alerts, 'addAlert').and.callThrough();
                spyOn(gettextCatalog, 'getString').and.callThrough();
                $ctrl.exportXLSX().then(() => {
                    expect(alerts.addAlert).toHaveBeenCalledWith(
                        'Contacts exported successfully as a XLSX file'
                    );
                    done();
                });
                scope.$digest();
            });

            it('should call $scope.$hide', (done) => {
                spyOn(scope, '$hide').and.callThrough();
                $ctrl.exportXLSX().then(() => {
                    expect(scope.$hide).toHaveBeenCalled();
                    done();
                });
                scope.$digest();
            });
        });
    });

    describe('filterParams', () => {
        it('should set filters', () => {
            expect($ctrl.filterParams({ test: 'test' }, null)).toEqual({
                test: 'test'
            });
        });

        it('should add ids', () => {
            expect($ctrl.filterParams({ test: 'test' }, [123, 456])).toEqual({
                test: 'test',
                ids: '123,456'
            });
        });

        describe('no filters', () => {
            it('should set default filters', () => {
                expect($ctrl.filterParams(null, null)).toEqual({
                    any_tags: false
                });
            });

            it('should call contacts.buildFilterParams', () => {
                spyOn(contacts, 'buildFilterParams').and.callThrough();
                $ctrl.filterParams(null, null);
                expect(contacts.buildFilterParams).toHaveBeenCalled();
            });

            it('should call api.cleanFilters', () => {
                spyOn(api, 'cleanFilters').and.callThrough();
                $ctrl.filterParams(null, null);
                expect(api.cleanFilters).toHaveBeenCalledWith({ any_tags: false });
            });

            it('should add ids', () => {
                expect($ctrl.filterParams(null, [123, 456])).toEqual({
                    any_tags: false,
                    ids: '123,456'
                });
            });
        });
    });
});
