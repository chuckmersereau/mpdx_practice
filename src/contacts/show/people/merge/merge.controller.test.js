import mc from './merge.controller';

const person = { id: 123, first_name: 'a', last_name: 'b' };

describe('contacts.show.people.merge.controller', () => {
    let $ctrl, controller, people, rootScope, scope, gettextCatalog;
    beforeEach(() => {
        angular.mock.module(mc);

        inject(($controller, $rootScope, _people_, _gettextCatalog_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            scope.$hide = () => {};
            people = _people_;
            gettextCatalog = _gettextCatalog_;
            controller = $controller;
            loadController(person);
        });

        spyOn(gettextCatalog, 'getString').and.callThrough();
    });

    function loadController() {
        $ctrl = controller('mergePeopleModalController as $ctrl', {
            $scope: scope,
            selectedPeople: [person, { id: 456 }]
        });
    }
    describe('save', () => {
        beforeEach(() => {
            spyOn(rootScope, '$emit').and.callThrough();
            spyOn(scope, '$hide');
        });

        it('should emit peopleMerged event', (done) => {
            spyOn(people, 'bulkMerge').and.callFake(() => Promise.resolve());
            $ctrl.selectedPerson = person.id;
            $ctrl.save().then(() => {
                expect(rootScope.$emit).toHaveBeenCalledWith('peopleMerged', 123, [456]);
                expect(scope.$hide).toHaveBeenCalled();
                done();
            });
        });
    });
});
