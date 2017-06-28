import component from './google.component';

const fakeBlockUI = {
    reset: () => {},
    start: () => {}
};

describe('tools.import.google.component', () => {
    let $ctrl, rootScope, scope, componentController, state, blockUI, gettextCatalog,
        alerts, contactsTags, google, importGoogle, modal;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, $state, _blockUI_, _gettextCatalog_, _alerts_, _contactsTags_, _google_, _importGoogle_, _modal_) => {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            state = $state;
            blockUI = _blockUI_;
            gettextCatalog = _gettextCatalog_;
            alerts = _alerts_;
            contactsTags = _contactsTags_;
            google = _google_;
            importGoogle = _importGoogle_;
            modal = _modal_;
            componentController = $componentController;
            loadController();
        });
    });
    function loadController() {
        spyOn(blockUI.instances, 'get').and.callFake(() => fakeBlockUI);
        $ctrl = componentController('importGoogle', {$scope: scope}, {});
        spyOn($ctrl.blockUI, 'reset').and.callThrough();
        spyOn($ctrl.blockUI, 'start').and.callThrough();
    }

    describe('constructor', () => {
        it('should set default values', () => {
            expect($ctrl.selected_account).toBeNull();
            expect($ctrl.import).toEqual({
                source: 'google',
                import_by_group: 'false',
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
                spyOn($ctrl, 'updateAccount').and.returnValue();
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

    describe('save', () => {
        let spy;

        beforeEach(() => {
            spy = spyOn(importGoogle, 'save').and.callFake(() => Promise.resolve());
        });

        it('should call importGoogle.save', () => {
            $ctrl.save();
            expect(importGoogle.save).toHaveBeenCalled();
        });

        it('should return a promise', () => {
            expect($ctrl.save()).toEqual(jasmine.any(Promise));
        });

        it('should start blockUI', () => {
            $ctrl.save();
            expect($ctrl.blockUI.start).toHaveBeenCalled();
        });

        describe('promise successful', () => {
            beforeEach(() => {
                spyOn(modal, 'info').and.callFake((message) => Promise.resolve(message));
            });

            it('should call blockUI.reset', (done) => {
                $ctrl.save().then(() => {
                    expect($ctrl.blockUI.reset).toHaveBeenCalled();
                    done();
                });
            });

            it('should call state.go', (done) => {
                spyOn(state, 'go').and.returnValue();
                $ctrl.save().then(() => {
                    expect(state.go).toHaveBeenCalledWith('tools');
                    done();
                });
            });

            it('should translate message', (done) => {
                spyOn(gettextCatalog, 'getString').and.returnValue();
                $ctrl.save().then(() => {
                    expect(gettextCatalog.getString).toHaveBeenCalledWith(
                        'Your Google import has started and your contacts will be in MPDX shortly. We will email you when your import is complete.'
                    );
                    done();
                });
            });

            it('should call modal info', (done) => {
                $ctrl.save().then(() => {
                    expect(modal.info).toHaveBeenCalledWith(
                        'Your Google import has started and your contacts will be in MPDX shortly. We will email you when your import is complete.'
                    );
                    done();
                });
            });
        });

        describe('promise rejected', () => {
            beforeEach(() => {
                spy.and.callFake(() => Promise.reject(new Error('something bad happened')));
            });

            it('should translate message', (done) => {
                spyOn(gettextCatalog, 'getString').and.returnValue();
                $ctrl.save().catch(() => {
                    expect(gettextCatalog.getString).toHaveBeenCalledWith(
                        'Unable to save changes.'
                    );
                    done();
                });
            });

            it('should call alerts.addAlert', (done) => {
                spyOn(alerts, 'addAlert').and.returnValue();
                $ctrl.save().catch(() => {
                    expect(alerts.addAlert).toHaveBeenCalledWith(
                        'Unable to save changes.', 'danger'
                    );
                    done();
                });
            });

            it('should call blockUI.reset', (done) => {
                $ctrl.save().catch(() => {
                    expect($ctrl.blockUI.reset).toHaveBeenCalled();
                    done();
                });
            });
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
});
