import mergeController from './merge.controller';

let contactList = [{ id: 1 }, { id: 2 }, { id: 3 }];

describe('contacts.list.merge.controller', () => {
    let $ctrl, controller, contacts, scope;
    beforeEach(() => {
        angular.mock.module(mergeController);
        inject(($controller, $rootScope, _contacts_) => {
            scope = $rootScope.$new();
            scope.$hide = () => {};
            contacts = _contacts_;
            controller = $controller;
            $ctrl = loadController();
        });
    });
    function loadController() {
        return controller('mergeContactsController as $ctrl', {
            $scope: scope,
            selectedContacts: contactList
        });
    }
    describe('constructor', () => {
        it('should pick the first contact as winner to start', () => {
            expect($ctrl.winner).toEqual(1);
        });
    });
    describe('save', () => {
        beforeEach(() => {
            spyOn(contacts, 'merge').and.callFake(() => Promise.resolve());
        });
        it('should call the api with winners and losers', () => {
            $ctrl.save();
            expect(contacts.merge).toHaveBeenCalledWith([{ winner_id: 1, loser_id: 2 }, { winner_id: 1, loser_id: 3 }]);
        });
        it('should hide', done => {
            spyOn(scope, '$hide').and.callThrough();
            $ctrl.save().then(() => {
                expect(scope.$hide).toHaveBeenCalledWith();
                done();
            });
        });
    });
});