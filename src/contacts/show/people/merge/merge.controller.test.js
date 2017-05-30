import mc from './merge.controller';

const person = {first_name: 'a', last_name: 'b'};

describe('contacts.show.people.merge.controller', () => {
    let $ctrl, controller, alerts, people, rootScope, scope, gettextCatalog;
    beforeEach(() => {
        angular.mock.module(mc);
        inject(($controller, $rootScope, _alerts_, _people_, _gettextCatalog_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            scope.$hide = () => {};
            alerts = _alerts_;
            people = _people_;
            gettextCatalog = _gettextCatalog_;
            controller = $controller;
            loadController(person);
        });
        spyOn(alerts, 'addAlert').and.callFake(data => data);
        spyOn(gettextCatalog, 'getString').and.callFake(data => data);
    });
    function loadController() {
        $ctrl = controller('mergePeopleModalController as $ctrl', {
            $scope: scope,
            selectedPeople: [person]
        });
    }
    describe('save', () => {
        beforeEach(() => {
            spyOn(rootScope, '$emit').and.callThrough();
            spyOn(scope, '$hide');
        });
        it('should call personUpdated', done => {
            spyOn(people, 'bulkMerge').and.callFake(() => Promise.resolve());
            $ctrl.selectedPerson = person;
            $ctrl.save().then(() => {
                expect(rootScope.$emit).toHaveBeenCalledWith('personUpdated');
                expect(scope.$hide).toHaveBeenCalled();
                done();
            });
        });
        it('should handle failure with a translated Message', done => {
            spyOn(people, 'bulkMerge').and.callFake(() => Promise.reject(Error('')));
            $ctrl.selectedPerson = person;
            $ctrl.save().then(() => {
                expect(gettextCatalog.getString).toHaveBeenCalled();
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'danger');
                expect(scope.$hide).toHaveBeenCalled();
                done();
            });
        });
    });
});