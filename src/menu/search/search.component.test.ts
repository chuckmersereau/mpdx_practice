import component from './search.component';
import { findIndex } from 'lodash/fp';

describe('menu.search.component', () => {
    let $ctrl, state, scope, contactFilter, contacts, timeout, q;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, $state, _contactFilter_, _contacts_, $timeout, $q) => {
            scope = $rootScope.$new();
            contactFilter = _contactFilter_;
            contacts = _contacts_;
            state = $state;
            timeout = $timeout;
            q = $q;
            $ctrl = $componentController('menuSearch', { $scope: scope }, {});
        });
        spyOn(state, 'go').and.callFake(() => {});
    });

    describe('reset', () => {
        it('should clear out searchParams', () => {
            $ctrl.searchParams = 'abc';
            $ctrl.reset();
            timeout.flush();
            expect($ctrl.searchParams).toEqual('');
        });

        it('should clear out contactList', () => {
            $ctrl.contactList = ['abc'];
            $ctrl.reset();
            timeout.flush();
            expect($ctrl.contactList).toEqual([]);
        });
    });

    describe('go', () => {
        beforeEach(() => {
            spyOn($ctrl, 'reset').and.callFake(() => {});
        });

        it('should clear out the value after navigation', () => {
            $ctrl.go('contact_id');
            expect($ctrl.reset).toHaveBeenCalled();
        });

        it('should navigate to the contact', () => {
            $ctrl.go('contact_id');
            expect(state.go).toHaveBeenCalledWith('contacts.show', { contactId: 'contact_id' });
        });
    });

    describe('gotoList', () => {
        beforeEach(() => {
            spyOn($ctrl, 'reset').and.callFake(() => {});
        });

        it('should change the wildcard search value for contact filters', () => {
            $ctrl.searchParams = 'abc';
            $ctrl.gotoList();
            expect(contactFilter.wildcardSearch).toEqual('abc');
        });

        it('should navigate to the contact list', () => {
            $ctrl.gotoList();
            expect(state.go).toHaveBeenCalledWith('contacts', {}, { reload: true });
        });

        it('should clear out the value after navigation', () => {
            $ctrl.gotoList();
            expect($ctrl.reset).toHaveBeenCalled();
        });

        describe('active contact', () => {
            beforeEach(() => {
                $ctrl.contactList = [{ id: 'active_contact_id', active: true }];
                spyOn($ctrl, 'go').and.callFake(() => {});
            });

            it('should navigate to the active contact', () => {
                $ctrl.gotoList();
                expect($ctrl.go).toHaveBeenCalledWith('active_contact_id');
            });
        });
    });

    describe('search', () => {
        beforeEach(() => {
            spyOn(contacts, 'search').and.callFake(() => q.resolve([{}]));
        });

        it('should return promise', () => {
            expect($ctrl.search()).toEqual(jasmine.any(q));
        });

        it('should call contacts.search', () => {
            $ctrl.searchParams = 'test';
            $ctrl.search();
            expect(contacts.search).toHaveBeenCalledWith('test');
        });

        describe('promise successful', () => {
            it('should save data to contactList', (done) => {
                $ctrl.search().then(() => {
                    done();
                });
                scope.$digest();
            });
        });
    });

    describe('keyUp', () => {
        let event;

        beforeEach(() => {
            $ctrl.contactList = [
                { id: 'contact_0' },
                { id: 'contact_1' },
                { id: 'contact_2' }
            ];
        });

        describe('keyCode 38', () => {
            beforeEach(() => {
                event = { keyCode: 38 };
            });

            describe('activeIndex none', () => {
                it('should change active to last', () => {
                    $ctrl.keyup(event);
                    expect(findIndex({ active: true }, $ctrl.contactList)).toEqual(2);
                });

                it('should change moreActive to false', () => {
                    $ctrl.moreActive = true;
                    $ctrl.keyup(event);
                    expect($ctrl.moreActive).toEqual(false);
                });
            });

            describe('activeIndex first', () => {
                beforeEach(() => {
                    $ctrl.contactList[0].active = true;
                });

                it('should change active to none', () => {
                    $ctrl.keyup(event);
                    expect(findIndex({ active: true }, $ctrl.contactList)).toEqual(-1);
                });

                it('should change moreActive to true', () => {
                    $ctrl.moreActive = false;
                    $ctrl.keyup(event);
                    expect($ctrl.moreActive).toEqual(true);
                });
            });

            describe('activeIndex last', () => {
                beforeEach(() => {
                    $ctrl.contactList[2].active = true;
                });

                it('should change active to second', () => {
                    $ctrl.keyup(event);

                    expect(findIndex({ active: true }, $ctrl.contactList)).toEqual(1);
                });

                it('should change moreActive to false', () => {
                    $ctrl.moreActive = true;
                    $ctrl.keyup(event);
                    expect($ctrl.moreActive).toEqual(false);
                });
            });
        });
        describe('keyCode 40', () => {
            beforeEach(() => {
                event = { keyCode: 40 };
            });

            describe('activeIndex none', () => {
                it('should change active to first', () => {
                    $ctrl.keyup(event);
                    expect(findIndex({ active: true }, $ctrl.contactList)).toEqual(0);
                });

                it('should change moreActive to false', () => {
                    $ctrl.moreActive = true;
                    $ctrl.keyup(event);
                    expect($ctrl.moreActive).toEqual(false);
                });
            });

            describe('activeIndex first', () => {
                beforeEach(() => {
                    $ctrl.contactList[0].active = true;
                });

                it('should change active to second', () => {
                    $ctrl.keyup(event);
                    expect(findIndex({ active: true }, $ctrl.contactList)).toEqual(1);
                });

                it('should change moreActive to false', () => {
                    $ctrl.moreActive = true;
                    $ctrl.keyup(event);
                    expect($ctrl.moreActive).toEqual(false);
                });
            });

            describe('activeIndex last', () => {
                beforeEach(() => {
                    $ctrl.contactList[2].active = true;
                });

                it('should change active to none', () => {
                    $ctrl.keyup(event);
                    expect(findIndex({ active: true }, $ctrl.contactList)).toEqual(-1);
                });

                it('should change moreActive to true', () => {
                    $ctrl.moreActive = false;
                    $ctrl.keyup(event);
                    expect($ctrl.moreActive).toEqual(true);
                });
            });
        });
    });
});
