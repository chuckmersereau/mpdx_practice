import component from './google.component';

const fakeBlockUI = {
    reset: () => {},
    start: () => {}
};

describe('tools.import.google.component', () => {
    let $ctrl, rootScope, scope, state, blockUI, gettextCatalog,
        api, contactsTags, google, modal, q;
    beforeEach(() => {
        angular.mock.module(component);
        inject((
            $componentController, $rootScope, $state, _blockUI_, _gettextCatalog_, _contactsTags_, _google_,
            _api_, _modal_, $q
        ) => {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            state = $state;
            blockUI = _blockUI_;
            gettextCatalog = _gettextCatalog_;
            contactsTags = _contactsTags_;
            google = _google_;
            api = _api_;
            api.account_list_id = 'account_list_id';
            modal = _modal_;
            q = $q;
            $ctrl = $componentController('importGoogle', { $scope: scope }, {});
        });
        spyOn(gettextCatalog, 'getString').and.callThrough();
        spyOn(blockUI.instances, 'get').and.callFake(() => fakeBlockUI);
        spyOn($ctrl.blockUI, 'reset').and.callThrough();
        spyOn($ctrl.blockUI, 'start').and.callThrough();
    });

    describe('constructor', () => {
        it('should set default values', () => {
            expect($ctrl.selected_account).toBeNull();
            expect($ctrl.import).toEqual({
                source: 'google',
                import_by_group: 'true',
                override: 'false',
                tag_list: [],
                in_preview: false
            });
        });
    });

    describe('events', () => {
        it('should handle account list change', () => {
            spyOn(contactsTags, 'load').and.callFake(() => {});
            $ctrl.$onInit();
            rootScope.$emit('accountListUpdated');
            expect(contactsTags.load).toHaveBeenCalled();
        });
    });

    describe('$onInit', () => {
        describe('google.data.length > 0', () => {
            beforeEach(() => {
                spyOn($ctrl, 'updateAccount').and.callFake(() => {});
                google.data = [{ id: 'google_account_1' }, { id: 'google_account_2' }];
            });

            it('should set selectedAccount', () => {
                $ctrl.$onInit();
                expect($ctrl.selectedAccount).toEqual({ id: 'google_account_1' });
            });

            it('should call updateAccount', () => {
                $ctrl.$onInit();
                expect($ctrl.updateAccount).toHaveBeenCalled();
            });
        });
    });

    describe('saveOrConfirm', () => {
        it('should call confirmThenSave if import_by_group is false', () => {
            spyOn($ctrl, 'confirmThenSave').and.callFake(() => {});
            $ctrl.import.import_by_group = 'false';
            $ctrl.saveOrConfirm();
            expect($ctrl.confirmThenSave).toHaveBeenCalledWith('Unable to save changes.');
        });
    });

    describe('confirmThenSave', () => {
        beforeEach(() => {
            spyOn(modal, 'confirm').and.returnValue(q.resolve());
            spyOn($ctrl, 'apiSave').and.returnValue(q.resolve());
        });

        it('should open a confirm modal', () => {
            const msg = 'Are you sure you want to import all contacts? This may import many contacts that you do not wish to have in MPDX. Many users find it more helpful to use the "Only import contacts from certain groups" option.';
            $ctrl.confirmThenSave();
            expect(gettextCatalog.getString).toHaveBeenCalledWith(msg);
            expect(modal.confirm).toHaveBeenCalledWith(msg);
        });

        it('should call apiSave', (done) => {
            $ctrl.confirmThenSave('a').then(() => {
                expect($ctrl.apiSave).toHaveBeenCalledWith($ctrl.import, 'a');
                done();
            });
            scope.$digest();
        });
    });

    describe('save', () => {
        let spy;

        beforeEach(() => {
            spy = spyOn($ctrl, 'apiSave').and.callFake(() => q.resolve());
        });

        it('should call importGoogle.save', () => {
            $ctrl.save();
            expect($ctrl.apiSave).toHaveBeenCalledWith({
                source: 'google',
                import_by_group: 'true',
                override: 'false',
                tag_list: [],
                in_preview: false
            }, 'Unable to save changes.');
            expect(gettextCatalog.getString).toHaveBeenCalledWith(
                'Unable to save changes.'
            );
        });

        describe('promise successful', () => {
            beforeEach(() => {
                spyOn(modal, 'info').and.callFake((message) => q.resolve(message));
            });

            it('should call blockUI.reset', (done) => {
                $ctrl.save().then(() => {
                    expect($ctrl.blockUI.reset).toHaveBeenCalled();
                    done();
                });
                rootScope.$digest();
            });

            it('should call state.go', (done) => {
                spyOn(state, 'go').and.callFake(() => {});
                $ctrl.save().then(() => {
                    expect(state.go).toHaveBeenCalledWith('tools');
                    done();
                });
                rootScope.$digest();
            });

            it('should translate message', (done) => {
                $ctrl.save().then(() => {
                    expect(gettextCatalog.getString).toHaveBeenCalledWith(
                        'Your Google import has started and your contacts will be in MPDX shortly. We will email you when your import is complete.'
                    );
                    done();
                });
                rootScope.$digest();
            });

            it('should call modal info', (done) => {
                $ctrl.save().then(() => {
                    expect(modal.info).toHaveBeenCalledWith(
                        'Your Google import has started and your contacts will be in MPDX shortly. We will email you when your import is complete.'
                    );
                    done();
                });
                rootScope.$digest();
            });
        });

        it('should call blockUI.reset', (done) => {
            spy.and.callFake(() => q.reject(new Error('something bad happened')));
            $ctrl.save().catch(() => {
                expect($ctrl.blockUI.reset).toHaveBeenCalled();
                done();
            });
            rootScope.$digest();
        });
    });

    describe('updateAccount', () => {
        let selectedAccount = {
            id: 'google_account_id',
            contact_groups: [
                {
                    id: 'group_id',
                    tag: 'tag_name'
                }
            ]
        };

        beforeEach(() => {
            $ctrl.import = {
                source_account: {
                    id: 'google_account_1'
                },
                groups: [{}, {}],
                group_tags: { test: 'id' }
            };
            $ctrl.selectedAccount = selectedAccount;
            $ctrl.updateAccount();
        });

        it('should set import.source_account', () => {
            expect($ctrl.import.source_account).toEqual({ id: 'google_account_id' });
        });

        it('should set import.groups', () => {
            expect($ctrl.import.groups).toEqual([]);
        });

        it('should set import.group_tags', () => {
            expect($ctrl.import.group_tags).toEqual({ group_id: ['tag_name'] });
        });
    });

    describe('checkAllGoogleContactGroups', () => {
        it('should set groups to all', () => {
            $ctrl.import.groups = ['group_0'];
            $ctrl.selectedAccount = {
                contact_groups: [{
                    id: 'group_0'
                }, {
                    id: 'group_1'
                }]
            };
            $ctrl.checkAllGoogleContactGroups();
            expect($ctrl.import.groups).toEqual(['group_0', 'group_1']);
        });
    });

    describe('uncheckAllGoogleContactGroups', () => {
        it('should set groups to none', () => {
            $ctrl.import.groups = ['group_0', 'group_1'];
            $ctrl.uncheckAllGoogleContactGroups();
            expect($ctrl.import.groups).toEqual([]);
        });
    });

    describe('apiSave', () => {
        const data = {
            tag_list: ['tag_1', 'tag_2'],
            group_tags: { test_1: ['tag_1', 'tag_2'], test_2: ['tag_3', 'tag_4'] }
        };

        const transformedData = {
            tag_list: 'tag_1,tag_2',
            group_tags: { test_1: 'tag_1,tag_2', test_2: 'tag_3,tag_4' }

        };

        beforeEach(() => {
            spyOn(api, 'post').and.callFake(() => q.resolve());
        });

        it('should return a promise', () => {
            expect($ctrl.apiSave(data)).toEqual(jasmine.any(q));
        });

        it('should call the api', () => {
            $ctrl.apiSave(data, 'a');
            expect(api.post).toHaveBeenCalledWith({
                url: `account_lists/${api.account_list_id}/imports/google`,
                data: transformedData,
                type: 'imports',
                errorMessage: 'a'
            });
        });

        it('should start blockUI', () => {
            $ctrl.apiSave(data, 'a');
            expect($ctrl.blockUI.start).toHaveBeenCalled();
        });
    });
});
