import mergeController from './merge.controller';

let contactList = [{ id: 1 }, { id: 2 }, { id: 3 }];

describe('contacts.list.merge.controller', () => {
    let $ctrl, controller, contacts, scope, q;

    function loadController() {
        return controller('mergeContactsController as $ctrl', {
            $scope: scope,
            selectedContacts: contactList
        });
    }

    beforeEach(() => {
        angular.mock.module(mergeController);
        inject(($controller, $rootScope, _contacts_, $q) => {
            scope = $rootScope.$new();
            scope.$hide = () => {};
            contacts = _contacts_;
            q = $q;
            controller = $controller;
            $ctrl = loadController();
        });
    });

    describe('constructor', () => {
        it('should pick the first contact as winner to start', () => {
            expect($ctrl.winner).toEqual(1);
        });
    });

    describe('save', () => {
        beforeEach(() => {
            spyOn(contacts, 'merge').and.callFake(() => q.resolve());
        });

        it('should call the api with winners and losers', () => {
            $ctrl.save();
            expect(contacts.merge).toHaveBeenCalledWith([{ winner_id: 1, loser_id: 2 }, { winner_id: 1, loser_id: 3 }]);
        });

        it('should hide', (done) => {
            spyOn(scope, '$hide').and.callThrough();
            $ctrl.save().then(() => {
                expect(scope.$hide).toHaveBeenCalledWith();
                done();
            });
            scope.$digest();
        });
    });
});