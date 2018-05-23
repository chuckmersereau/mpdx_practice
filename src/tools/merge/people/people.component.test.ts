import component from './people.component';

describe('tools.mergePeople.component', () => {
    let $ctrl, rootScope, scope, componentController, alerts, gettextCatalog, state, api, people, tools, q;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, $state, _alerts_, _api_, _gettextCatalog_, _people_, _tools_, $q) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            alerts = _alerts_;
            api = _api_;
            gettextCatalog = _gettextCatalog_;
            people = _people_;
            tools = _tools_;
            state = $state;
            q = $q;
            componentController = $componentController;
            $ctrl = componentController('mergePeople', { $scope: scope }, {});
        });
    });

    describe('$onInit', () => {
        beforeEach(() => {
            spyOn($ctrl, 'load').and.callFake(() => q.resolve({}));
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
            duplicate = { people: [{ id: 1 }, { id: 2 }] };
        });

        it('should pick winner 1', () => {
            $ctrl.select(duplicate, 0);
            expect(duplicate.ignored).toBeFalsy();
            expect(duplicate.people[0].selected).toBeTruthy();
            expect(duplicate.people[1].selected).toBeFalsy();
        });

        it('should un-pick winner 1', () => {
            duplicate.people[0].selected = true;
            duplicate.people[1].selected = false;
            $ctrl.select(duplicate, 0);
            expect(duplicate.ignored).toBeFalsy();
            expect(duplicate.people[0].selected).toBeFalsy();
            expect(duplicate.people[1].selected).toBeFalsy();
        });

        it('should pick winner 2', () => {
            $ctrl.select(duplicate, 1);
            expect(duplicate.ignored).toBeFalsy();
            expect(duplicate.people[1].selected).toBeTruthy();
            expect(duplicate.people[0].selected).toBeFalsy();
        });

        it('should un-pick winner 2', () => {
            duplicate.people[0].selected = false;
            duplicate.people[1].selected = true;
            $ctrl.select(duplicate, 1);
            expect(duplicate.ignored).toBeFalsy();
            expect(duplicate.people[0].selected).toBeFalsy();
            expect(duplicate.people[1].selected).toBeFalsy();
        });
    });

    describe('selectIgnore', () => {
        let duplicate;

        beforeEach(() => {
            duplicate = { people: [{ id: 1 }, { id: 2 }] };
        });

        it('should set ignore', () => {
            $ctrl.selectIgnore(duplicate);
            expect(duplicate.ignore).toBeTruthy();
            expect(duplicate.people[0].selected).toBeFalsy();
            expect(duplicate.people[1].selected).toBeFalsy();
        });
    });

    describe('confirm', () => {
        beforeEach(() => {
            spyOn($ctrl, 'merge').and.callFake(() => q.resolve());
            spyOn($ctrl, 'ignore').and.callFake(() => q.resolve());
        });

        it('should show loading screen', () => {
            $ctrl.confirm();
        });

        it('should handle bulk merging of people', () => {
            $ctrl.duplicates = [
                { ignore: false, people: [{ id: 1, selected: true }, { id: 2 }] },
                { ignore: false, people: [{ id: 3 }, { id: 4, selected: true }] },
                { ignore: true, people: [{ id: 5 }, { id: 6, selected: true }] },
                { ignore: false, people: [{ id: 7 }, { id: 8 }] }
            ];
            $ctrl.confirm();
            expect($ctrl.merge).toHaveBeenCalledWith([
                { ignore: false, people: [{ id: 1, selected: true }, { id: 2 }] },
                { ignore: false, people: [{ id: 3 }, { id: 4, selected: true }] }
            ]);
        });

        it('should handle multiple ignores', () => {
            $ctrl.duplicates = [
                { ignore: true, people: [{ id: 1 }, { id: 2 }] },
                { ignore: false, people: [{ id: 3 }, { id: 4 }] },
                { ignore: true, people: [{ id: 4 }, { id: 5 }] }
            ];
            $ctrl.confirm();
            expect($ctrl.ignore).toHaveBeenCalledWith([
                { ignore: true, people: [{ id: 1 }, { id: 2 }] },
                { ignore: true, people: [{ id: 4 }, { id: 5 }] }
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
            spyOn($ctrl, 'confirm').and.callFake(() => q.resolve());
            spyOn($ctrl, 'load').and.callFake(() => q.resolve());
        });

        it('should call confirm', () => {
            $ctrl.confirmAndContinue();
            expect($ctrl.confirm).toHaveBeenCalledWith();
        });

        it('should reload new people', (done) => {
            $ctrl.confirmAndContinue().then(() => {
                expect($ctrl.load).toHaveBeenCalledWith();
                done();
            });
            rootScope.$digest();
        });

        it('should hide the load screen', (done) => {
            $ctrl.confirmAndContinue().then(() => {
                done();
            });
            rootScope.$digest();
        });
    });

    describe('confirmThenLeave', () => {
        beforeEach(() => {
            spyOn($ctrl, 'confirm').and.callFake(() => q.resolve());
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
            rootScope.$digest();
        });

        it('should hide the load screen', (done) => {
            $ctrl.confirmThenLeave().then(() => {
                done();
            });
            rootScope.$digest();
        });
    });

    describe('ignore', () => {
        it('should create an array of api delete promises', () => {
            spyOn(api, 'put').and.callFake(() => q.resolve());
            expect($ctrl.ignore([{ id: 1 }, { id: 2 }])).toEqual([jasmine.any(q), jasmine.any(q)]);
            expect(api.put).toHaveBeenCalledWith({
                url: 'contacts/people/duplicates/1',
                data: { id: 1, ignore: true },
                type: 'duplicate_record_pairs'
            });
            expect(api.put).toHaveBeenCalledWith({
                url: 'contacts/people/duplicates/2',
                data: { id: 2, ignore: true },
                type: 'duplicate_record_pairs'
            });
        });
    });

    describe('merge', () => {
        it('should call bulkMerge with data', () => {
            spyOn(people, 'bulkMerge').and.callFake(() => q.resolve());
            $ctrl.merge([
                { people: [{ id: 1, selected: true }, { id: 2 }] },
                { people: [{ id: 3 }, { id: 4, selected: true }] }
            ]);
            expect(people.bulkMerge).toHaveBeenCalledWith([
                { winner_id: 1, loser_id: 2 },
                { winner_id: 4, loser_id: 3 }
            ]);
        });
    });

    describe('load', () => {
        beforeEach(() => {
            $ctrl.duplicates = [{ people: [{ id: 1 }, { id: 2 }] }];
        });

        it('should reset duplicates', () => {
            $ctrl.load();
            expect($ctrl.duplicates).toEqual([]);
        });

        it('should query the api', () => {
            spyOn(api, 'get').and.callFake(() => q.resolve());
            $ctrl.load();
            expect(api.get).toHaveBeenCalledWith('contacts/people/duplicates', {
                include: 'records,records.phone_numbers,records.email_addresses',
                fields: {
                    people: 'avatar,email_addresses,phone_numbers,first_name,last_name,created_at',
                    phone_numbers: 'primary,number,source',
                    email_addresses: 'primary,email,source',
                    person_duplicates: 'people,shared_contact'
                },
                filter: { account_list_id: api.account_list_id, ignore: false },
                per_page: 5
            });
        });

        it('should call set meta', (done) => {
            let data = [{ id: 1 }];
            spyOn(api, 'get').and.callFake(() => q.resolve(data));
            spyOn($ctrl, 'setMeta').and.callThrough();
            $ctrl.load().then(() => {
                expect($ctrl.setMeta).toHaveBeenCalled();
                done();
            });
            rootScope.$digest();
        });

        it('should map data', (done) => {
            let data: any = [{ id: 1, records: [{ id: 'person_1_id' }, { id: 'person_2_id' }] }];
            data.meta = { pagination: { total_count: 2 } };
            spyOn(api, 'get').and.callFake(() => q.resolve(data));
            $ctrl.load().then(() => {
                expect($ctrl.duplicates).toEqual(data);
                done();
            });
            rootScope.$digest();
        });
    });

    describe('setMeta', () => {
        it('should set meta', () => {
            $ctrl.setMeta(['data']);
            expect($ctrl.meta).toEqual(['data']);
        });

        it('should set tools.analytics', () => {
            $ctrl.setMeta({ pagination: { total_count: 123 } });
            expect(tools.analytics['duplicate-people']).toEqual(123);
        });
    });

    describe('confirmButtonDisabled', () => {
        describe('ignore', () => {
            it('should return false', () => {
                $ctrl.duplicates = [
                    { people: [{ id: 1 }, { id: 2 }] },
                    { people: [{ id: 3 }, { id: 4 }] },
                    { people: [{ id: 5 }, { id: 6 }], ignore: true }
                ];
                expect($ctrl.confirmButtonDisabled()).toEqual(false);
            });
        });

        describe('person 0 selected', () => {
            it('should return false', () => {
                $ctrl.duplicates = [
                    { people: [{ id: 1, selected: true }, { id: 2 }] },
                    { people: [{ id: 3 }, { id: 4 }] },
                    { people: [{ id: 5 }, { id: 6 }] }
                ];
                expect($ctrl.confirmButtonDisabled()).toEqual(false);
            });
        });

        describe('person 1 selected', () => {
            it('should return false', () => {
                $ctrl.duplicates = [
                    { people: [{ id: 1 }, { id: 2 }] },
                    { people: [{ id: 3 }, { id: 4, selected: true }] },
                    { people: [{ id: 5 }, { id: 6 }] }
                ];
                expect($ctrl.confirmButtonDisabled()).toEqual(false);
            });
        });

        describe('nothing selected', () => {
            it('should return true', () => {
                $ctrl.duplicates = [
                    { people: [{ id: 1 }, { id: 2 }] },
                    { people: [{ id: 3 }, { id: 4 }] },
                    { people: [{ id: 5 }, { id: 6 }] }
                ];
                expect($ctrl.confirmButtonDisabled()).toEqual(true);
            });
        });
    });
});
