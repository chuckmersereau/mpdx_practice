import ctrlr from './modal.controller';

describe('tasks.modals.add.controller', () => {
    let $ctrl, api, scope, rootScope, contacts, state, q;
    beforeEach(() => {
        angular.mock.module(ctrlr);
        inject(($controller, $rootScope, _api_, _contacts_, $state, $q) => {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            api = _api_;
            contacts = _contacts_;
            state = $state;
            q = $q;
            scope.$hide = () => {};
            $ctrl = $controller('removeContactModalController as $ctrl', {
                $scope: scope
            });
        });
    });

    describe('removeContact', () => {
        beforeEach(() => {
            contacts.current = {
                id: 'contact_id',
                name: 'joe'
            };
            spyOn(api, 'delete').and.callFake(() => q.resolve());
            spyOn(state, 'go').and.callFake(() => {});
            spyOn(scope, '$hide').and.callFake(() => {});
        });

        it('should delete the contact', (done) => {
            $ctrl.removeContact().then(() => {
                expect(api.delete).toHaveBeenCalledWith({
                    url: 'contacts/contact_id',
                    type: 'contact'
                });
                done();
            });
            scope.$digest();
        });

        it('should hide the current modal', (done) => {
            $ctrl.removeContact().then(() => {
                expect(scope.$hide).toHaveBeenCalledWith();
                done();
            });
            scope.$digest();
        });

        it('should return to the contact list', (done) => {
            $ctrl.removeContact().then(() => {
                expect(state.go).toHaveBeenCalledWith('contacts');
                done();
            });
            scope.$digest();
        });
    });

    describe('hideContact', () => {
        beforeEach(() => {
            contacts.current = {
                id: 'contact_id',
                name: 'joe'
            };
            spyOn(contacts, 'hideContact').and.callFake(() => {});
            spyOn(scope, '$hide').and.callFake(() => {});
        });

        it('should hide the current modal', () => {
            $ctrl.hideContact();
            expect(scope.$hide).toHaveBeenCalledWith();
        });

        it('should call hideContact', () => {
            $ctrl.hideContact();
            expect(contacts.hideContact).toHaveBeenCalledWith(contacts.current);
        });
    });
});