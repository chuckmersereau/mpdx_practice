import component from './relationships.component';

describe('contacts.show.personModal.family.component', () => {
    let $ctrl, rootScope, scope, componentController, api;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _api_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            api = _api_;
            componentController = $componentController;
            api.account_list_id = 1234;
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('contactFamilyRelationship', { $scope: scope }, { onRemove: () => {} });
    }
    describe('$onInit', () => {
        it('should set the display_name for the search button/box', () => {
            $ctrl.familyRelationship = {
                related_person: {
                    last_name: 'b',
                    first_name: 'a'
                }
            };
            $ctrl.$onInit();
            expect($ctrl.familyRelationship.related_person.display_name).toEqual('a b');
        });
        it('should properly handle undefined', () => {
            $ctrl.familyRelationship = {
                related_person: {}
            };
            $ctrl.$onInit();
            expect($ctrl.familyRelationship.related_person.display_name).toBeUndefined();
        });
    });
    describe('remove', () => {
        beforeEach(() => {
            spyOn($ctrl, 'onRemove').and.callThrough();
        });
        it('should set remove flag', () => {
            $ctrl.remove();
            expect($ctrl.deleted).toEqual(true);
        });
        it('should call remove fn', () => {
            $ctrl.remove();
            expect($ctrl.onRemove).toHaveBeenCalledWith();
        });
    });
    describe('search', () => {
        it('should query the api', () => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve());
            $ctrl.search('abc');
            expect(api.get).toHaveBeenCalledWith(
                'contacts/people', {
                    fields: {
                        people: 'first_name,last_name'
                    },
                    filter: {
                        wildcard_search: 'abc'
                    },
                    per_page: 10000
                }
            );
        });
        it('should map the results', (done) => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve([{ first_name: 'a', last_name: 'b' }]));
            $ctrl.search('').then((data) => {
                expect(data).toEqual([{ first_name: 'a', last_name: 'b', display_name: 'a b' }]);
                done();
            });
        });
    });
    describe('select', () => {
        it('should set the related_person', () => {
            $ctrl.familyRelationship = {};
            $ctrl.select({ id: 1 });
            expect($ctrl.familyRelationship.related_person).toEqual({ id: 1 });
        });
    });
});
