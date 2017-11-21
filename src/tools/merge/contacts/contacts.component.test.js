import component from './contacts.component';

describe('tools.mergeContacts.component', () => {
    let $ctrl, rootScope, scope, componentController, alerts, gettextCatalog, state, api, contacts, tools;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, $state, _alerts_, _api_, _gettextCatalog_, _contacts_, _tools_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            alerts = _alerts_;
            api = _api_;
            gettextCatalog = _gettextCatalog_;
            contacts = _contacts_;
            tools = _tools_;
            state = $state;
            componentController = $componentController;
            $ctrl = componentController('mergeContacts', { $scope: scope }, {});
        });
    });

    describe('$onInit', () => {
        beforeEach(() => {
            spyOn($ctrl, 'load').and.callFake(() => Promise.resolve({}));
        });

        it('will call load', () => {
            $ctrl.$onInit();
            expect($ctrl.load).toHaveBeenCalledWith();
        });

        it('will reload on accountListUpdated', () => {
            $ctrl.$onInit();
            rootScope.$emit('accountListUpdated');
            expect($ctrl.load).toHaveBeenCalledWith();
        });
    });

    describe('select', () => {
        let duplicate;

        beforeEach(() => {
            duplicate = { contacts: [{ id: 1 }, { id: 2 }] };
        });

        it('should pick winner 1', () => {
            $ctrl.select(duplicate, 0);
            expect(duplicate.ignored).toBeFalsy();
            expect(duplicate.contacts[0].selected).toBeTruthy();
            expect(duplicate.contacts[1].selected).toBeFalsy();
        });

        it('should un-pick winner 1', () => {
            duplicate.contacts[0].selected = true;
            duplicate.contacts[1].selected = false;
            $ctrl.select(duplicate, 0);
            expect(duplicate.ignored).toBeFalsy();
            expect(duplicate.contacts[0].selected).toBeFalsy();
            expect(duplicate.contacts[1].selected).toBeFalsy();
        });

        it('should pick winner 2', () => {
            $ctrl.select(duplicate, 1);
            expect(duplicate.ignored).toBeFalsy();
            expect(duplicate.contacts[1].selected).toBeTruthy();
            expect(duplicate.contacts[0].selected).toBeFalsy();
        });

        it('should un-pick winner 2', () => {
            duplicate.contacts[0].selected = false;
            duplicate.contacts[1].selected = true;
            $ctrl.select(duplicate, 1);
            expect(duplicate.ignored).toBeFalsy();
            expect(duplicate.contacts[0].selected).toBeFalsy();
            expect(duplicate.contacts[1].selected).toBeFalsy();
        });
    });

    describe('selectIgnore', () => {
        let duplicate;

        beforeEach(() => {
            duplicate = { contacts: [{ id: 1 }, { id: 2 }] };
        });

        it('should set ignore', () => {
            $ctrl.selectIgnore(duplicate);
            expect(duplicate.ignore).toBeTruthy();
            expect(duplicate.contacts[0].selected).toBeFalsy();
            expect(duplicate.contacts[1].selected).toBeFalsy();
        });
    });

    describe('confirm', () => {
        beforeEach(() => {
            spyOn($ctrl, 'merge').and.callFake(() => Promise.resolve());
            spyOn($ctrl, 'ignore').and.callFake(() => Promise.resolve());
        });

        it('should show loading screen', () => {
            $ctrl.confirm();
        });

        it('should handle bulk merging of contacts', () => {
            $ctrl.duplicates = [
                { ignore: false, contacts: [{ id: 1, selected: true }, { id: 2 }] },
                { ignore: false, contacts: [{ id: 3 }, { id: 4, selected: true }] },
                { ignore: true, contacts: [{ id: 5 }, { id: 6, selected: true }] },
                { ignore: false, contacts: [{ id: 7 }, { id: 8 }] }
            ];
            $ctrl.confirm();
            expect($ctrl.merge).toHaveBeenCalledWith([
                { ignore: false, contacts: [{ id: 1, selected: true }, { id: 2 }] },
                { ignore: false, contacts: [{ id: 3 }, { id: 4, selected: true }] }
            ]);
        });

        it('should handle multiple ignores', () => {
            $ctrl.duplicates = [
                { ignore: true, contacts: [{ id: 1 }, { id: 2 }] },
                { ignore: false, contacts: [{ id: 3 }, { id: 4 }] },
                { ignore: true, contacts: [{ id: 4 }, { id: 5 }] }
            ];
            $ctrl.confirm();
            expect($ctrl.ignore).toHaveBeenCalledWith([
                { ignore: true, contacts: [{ id: 1 }, { id: 2 }] },
                { ignore: true, contacts: [{ id: 4 }, { id: 5 }] }
            ]);
        });

        it('should show a translated alert on completion', (done) => {
            spyOn(alerts, 'addAlert').and.callFake((data) => data);
            spyOn(gettextCatalog, 'getString').and.callThrough();
            $ctrl.confirm().then(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String));
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
            rootScope.$apply();
        });
    });

    describe('confirmAndContinue', () => {
        beforeEach(() => {
            spyOn($ctrl, 'confirm').and.callFake(() => Promise.resolve());
            spyOn($ctrl, 'load').and.callFake(() => Promise.resolve());
        });

        it('should call confirm', () => {
            $ctrl.confirmAndContinue();
            expect($ctrl.confirm).toHaveBeenCalledWith();
        });

        it('should reload new contacts', (done) => {
            $ctrl.confirmAndContinue().then(() => {
                expect($ctrl.load).toHaveBeenCalledWith();
                done();
            });
        });

        it('should hide the load screen', (done) => {
            $ctrl.confirmAndContinue().then(() => {
                done();
            });
        });
    });

    describe('confirmThenLeave', () => {
        beforeEach(() => {
            spyOn($ctrl, 'confirm').and.callFake(() => Promise.resolve());
            spyOn(state, 'go').and.callFake(() => {});
        });

        it('should call confirm', () => {
            $ctrl.confirmThenLeave();
            expect($ctrl.confirm).toHaveBeenCalledWith();
        });

        it('should navigate to tools homepage', (done) => {
            $ctrl.confirmThenLeave().then(() => {
                expect(state.go).toHaveBeenCalledWith('tools');
                done();
            });
        });

        it('should hide the load screen', (done) => {
            $ctrl.confirmThenLeave().then(() => {
                done();
            });
        });
    });

    describe('ignore', () => {
        it('should create an array of api delete promises', () => {
            spyOn(api, 'put').and.callFake(() => Promise.resolve());
            expect($ctrl.ignore([{ id: 1 }, { id: 2 }])).toEqual([jasmine.any(Promise), jasmine.any(Promise)]);
            expect(api.put).toHaveBeenCalledWith({
                url: 'contacts/duplicates/1',
                data: { id: 1, ignore: true },
                type: 'duplicate_record_pairs'
            });
            expect(api.put).toHaveBeenCalledWith({
                url: 'contacts/duplicates/2',
                data: { id: 2, ignore: true },
                type: 'duplicate_record_pairs'
            });
        });
    });

    describe('merge', () => {
        it('should call bulkMerge with data', () => {
            spyOn(contacts, 'merge').and.callFake(() => Promise.resolve());
            $ctrl.merge([
                { contacts: [{ id: 1, selected: true }, { id: 2 }] },
                { contacts: [{ id: 3 }, { id: 4, selected: true }] }
            ]);
            expect(contacts.merge).toHaveBeenCalledWith([
                { winner_id: 1, loser_id: 2 },
                { winner_id: 4, loser_id: 3 }
            ]);
        });
    });

    describe('load', () => {
        beforeEach(() => {
            $ctrl.duplicates = [{ contacts: [{ id: 1 }, { id: 2 }] }];
        });

        it('should reset duplicates', () => {
            $ctrl.load();
            expect($ctrl.duplicates).toEqual([]);
        });

        it('should query the api', () => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve());
            $ctrl.load();
            expect(api.get).toHaveBeenCalledWith('contacts/duplicates', {
                include: 'records,records.addresses',
                fields: {
                    contacts: 'addresses,name,square_avatar,status,created_at',
                    addresses: 'city,postal_code,primary_mailing_address,state,street,source'
                },
                filter: { account_list_id: api.account_list_id, ignore: false },
                per_page: 5
            });
        });

        it('should call set meta', (done) => {
            let data = [{ id: 1 }];
            spyOn(api, 'get').and.callFake(() => Promise.resolve(data));
            spyOn($ctrl, 'setMeta').and.callThrough();
            $ctrl.load().then(() => {
                expect($ctrl.setMeta).toHaveBeenCalled();
                done();
            });
        });

        it('should map data', (done) => {
            let data = [{ id: 1, records: [{ id: 'contact_1_id' }, { id: 'contact_2_id' }] }];
            data.meta = { pagination: { total_count: 2 } };
            spyOn(api, 'get').and.callFake(() => Promise.resolve(data));
            $ctrl.load().then(() => {
                expect($ctrl.duplicates).toEqual(data);
                done();
            });
        });
    });

    describe('setMeta', () => {
        it('should set meta', () => {
            $ctrl.setMeta(['data']);
            expect($ctrl.meta).toEqual(['data']);
        });

        it('should set tools.analytics', () => {
            $ctrl.setMeta({ pagination: { total_count: 123 } });
            expect(tools.analytics['duplicate-contacts']).toEqual(123);
        });
    });

    describe('confirmButtonDisabled', () => {
        describe('ignore', () => {
            it('should return false', () => {
                $ctrl.duplicates = [
                    { contacts: [{ id: 1 }, { id: 2 }] },
                    { contacts: [{ id: 3 }, { id: 4 }] },
                    { contacts: [{ id: 5 }, { id: 6 }], ignore: true }
                ];
                expect($ctrl.confirmButtonDisabled()).toEqual(false);
            });
        });

        describe('contact 0 selected', () => {
            it('should return false', () => {
                $ctrl.duplicates = [
                    { contacts: [{ id: 1, selected: true }, { id: 2 }] },
                    { contacts: [{ id: 3 }, { id: 4 }] },
                    { contacts: [{ id: 5 }, { id: 6 }] }
                ];
                expect($ctrl.confirmButtonDisabled()).toEqual(false);
            });
        });

        describe('contact 1 selected', () => {
            it('should return false', () => {
                $ctrl.duplicates = [
                    { contacts: [{ id: 1 }, { id: 2 }] },
                    { contacts: [{ id: 3 }, { id: 4, selected: true }] },
                    { contacts: [{ id: 5 }, { id: 6 }] }
                ];
                expect($ctrl.confirmButtonDisabled()).toEqual(false);
            });
        });

        describe('nothing selected', () => {
            it('should return true', () => {
                $ctrl.duplicates = [
                    { contacts: [{ id: 1 }, { id: 2 }] },
                    { contacts: [{ id: 3 }, { id: 4 }] },
                    { contacts: [{ id: 5 }, { id: 6 }] }
                ];
                expect($ctrl.confirmButtonDisabled()).toEqual(true);
            });
        });
    });
});
