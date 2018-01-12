import component from './addresses.component';

const fakeBlockUI = {
    reset: () => {},
    start: () => {}
};

describe('tools.fix.addresses.component', () => {
    let $ctrl, rootScope, scope, componentController, gettextCatalog, blockUI, modal, contacts, tools, api, filter;
    beforeEach(() => {
        angular.mock.module(component);
        inject((
            $componentController, $rootScope, _gettextCatalog_, _blockUI_, _modal_, _contacts_, _tools_, _api_, $filter
        ) => {
            filter = $filter;
            rootScope = $rootScope;
            scope = rootScope.$new();
            gettextCatalog = _gettextCatalog_;
            blockUI = _blockUI_;
            modal = _modal_;
            contacts = _contacts_;
            tools = _tools_;
            api = _api_;
            componentController = $componentController;
            loadController();
        });
    });

    function loadController() {
        spyOn(blockUI.instances, 'get').and.callFake(() => fakeBlockUI);
        $ctrl = componentController('fixAddresses', { $scope: scope });
        spyOn($ctrl.blockUI, 'start').and.callThrough();
        spyOn($ctrl.blockUI, 'reset').and.callThrough();
    }

    describe('constructor', () => {
        it('should set default values', () => {
            expect($ctrl.source).toEqual('MPDX');
        });

        it('should get instance of blockUI', () => {
            expect(blockUI.instances.get).toHaveBeenCalledWith('fix-addresses');
            expect($ctrl.blockUI).toEqual(fakeBlockUI);
        });
    });
    describe('events', () => {
        it('should fire load on accountListUpdated', () => {
            $ctrl.$onInit();
            spyOn($ctrl, 'load').and.callFake(() => Promise.resolve());
            rootScope.$emit('accountListUpdated');
            expect($ctrl.load).toHaveBeenCalled();
            $ctrl.$onDestroy();
        });
    });

    describe('load', () => {
        beforeEach(() => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve(apiData));
        });

        it('should call the api', () => {
            $ctrl.load();
            expect(api.get).toHaveBeenCalledWith('contacts', {
                filter: {
                    address_valid: false,
                    account_list_id: api.account_list_id,
                    deceased: false
                },
                fields: {
                    contacts: 'name,avatar,addresses'
                },
                include: 'addresses',
                page: 1,
                per_page: 25,
                sort: 'name'
            });
        });

        describe('promise successful', () => {
            it('should set loading to false', (done) => {
                $ctrl.loading = true;
                $ctrl.load().then(() => {
                    expect($ctrl.loading).toBeFalsy();
                    done();
                });
            });

            it('should call set meta', (done) => {
                spyOn($ctrl, 'setMeta').and.callThrough();
                $ctrl.load().then(() => {
                    expect($ctrl.setMeta).toHaveBeenCalled();
                    done();
                });
            });

            it('should collect list of sources', (done) => {
                $ctrl.load().then(() => {
                    expect($ctrl.sources).toEqual([
                        { id: 'Dataserver', value: filter('sourceToStr')('Dataserver') },
                        { id: 'MPDX', value: filter('sourceToStr')('MPDX') },
                        { id: 'Sibel', value: filter('sourceToStr')('Sibel') },
                        { id: 'Tntmpd', value: filter('sourceToStr')('Tntmpd') }
                    ]);
                    done();
                });
            });

            it('should store data', (done) => {
                $ctrl.load().then((data) => {
                    expect(data).toEqual(apiData);
                    done();
                });
            });

            it('should store meta', (done) => {
                $ctrl.load().then((data) => {
                    expect(data.meta).toEqual(apiData.meta);
                    done();
                });
            });

            describe('data set', () => {
                beforeEach(() => {
                    $ctrl.data = apiData;
                    $ctrl.page = 1;
                });
                describe('reset set to true', () => {
                    it('should call the api', (done) => {
                        $ctrl.load(true).then(() => {
                            expect(api.get).toHaveBeenCalled();
                            done();
                        });
                    });
                });

                describe('reset set to false', () => {
                    describe('page is current page', () => {
                        it('should not call the api', (done) => {
                            $ctrl.load(false, 1).then(() => {
                                expect(api.get).not.toHaveBeenCalled();
                                done();
                            });
                        });

                        it('should return set data', (done) => {
                            $ctrl.load(false, 1).then((data) => {
                                expect(data).toEqual($ctrl.data);
                                done();
                            });
                        });

                        it('should return a promise', () => {
                            expect($ctrl.load(false, 1)).toEqual(jasmine.any(Promise));
                        });
                    });

                    describe('page is not current page', () => {
                        it('should call the api', (done) => {
                            $ctrl.load(false, 2).then(() => {
                                expect(api.get).toHaveBeenCalled();
                                done();
                            });
                        });

                        it('should set page', (done) => {
                            expect($ctrl.page).toEqual(1);
                            $ctrl.load(false, 2).then(() => {
                                expect($ctrl.page).toEqual(2);
                                done();
                            });
                        });
                    });
                });
            });
        });
    });

    describe('save', () => {
        beforeEach(() => {
            spyOn(modal, 'confirm').and.callFake(() => Promise.resolve());
            spyOn(gettextCatalog, 'getString').and.callThrough();
        });

        it('should call a translated confirm message', () => {
            $ctrl.save();
            expect(gettextCatalog.getString).toHaveBeenCalledWith(`You are updating all contacts visible on this page, setting the first {{source}} address as the primary address.
            If no such address exists the contact will not be updated. Are you sure you want to do this?`,
                { source: 'MPDX' });
        });

        it('should open a confirm modal', () => {
            $ctrl.save();
            expect(modal.confirm).toHaveBeenCalledWith(`You are updating all contacts visible on this page, setting the first MPDX address as the primary address.
            If no such address exists the contact will not be updated. Are you sure you want to do this?`);
        });

        it('should return a promise', () => {
            expect($ctrl.save()).toEqual(jasmine.any(Promise));
        });

        describe('on confirmation', () => {
            beforeEach(() => {
                spyOn($ctrl, 'bulkSave').and.callFake(() => Promise.resolve());
            });

            it('should call bulk save with source', (done) => {
                $ctrl.save().then(() => {
                    expect($ctrl.bulkSave).toHaveBeenCalledWith('MPDX');
                    done();
                });
            });

            it('should have toggled blockUI', (done) => {
                $ctrl.save().then(() => {
                    expect($ctrl.blockUI.start).toHaveBeenCalled();
                    expect($ctrl.blockUI.reset).toHaveBeenCalled();
                    done();
                });
            });
        });
    });

    describe('bulkSave', () => {
        beforeEach(() => {
            $ctrl.data = [{
                id: 'contact_id_0',
                addresses: [
                    {
                        id: 'address_id_0',
                        source: 'Sibel',
                        primary_mailing_address: true
                    }, {
                        id: 'address_id_1',
                        source: 'MPDX',
                        primary_mailing_address: false
                    }, {
                        id: 'address_id_2',
                        source: 'MPDX',
                        primary_mailing_address: false
                    }
                ]
            }, {
                id: 'contact_id_1',
                addresses: [
                    {
                        id: 'address_id_3',
                        source: 'Sibel',
                        primary_mailing_address: true
                    }
                ]
            }];
            spyOn(contacts, 'bulkSave').and.callFake(() => Promise.resolve());
        });


        it('should return a promise', () => {
            expect($ctrl.bulkSave('MPDX')).toEqual(jasmine.any(Promise));
        });

        it('should call the contacts service', () => {
            $ctrl.bulkSave('MPDX');
            expect(contacts.bulkSave).toHaveBeenCalledWith(
                [{
                    id: 'contact_id_0',
                    addresses: [
                        {
                            id: 'address_id_0',
                            source: 'Sibel',
                            primary_mailing_address: false,
                            valid_values: true
                        }, {
                            id: 'address_id_1',
                            source: 'MPDX',
                            primary_mailing_address: true,
                            valid_values: true
                        }, {
                            id: 'address_id_2',
                            source: 'MPDX',
                            primary_mailing_address: false,
                            valid_values: true
                        }
                    ]
                }]
            );
        });

        describe('promise successful', () => {
            beforeEach(() => {
                spyOn($ctrl, 'load').and.callFake(() => Promise.resolve());
            });

            it('should call load', (done) => {
                $ctrl.bulkSave('MPDX').then(() => {
                    expect($ctrl.load).toHaveBeenCalledWith(true);
                    done();
                });
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
            expect(tools.analytics['fix-addresses']).toEqual(123);
        });
    });

    describe('onSave', () => {
        const contact = { id: 'contact_id', addresses: [{}, {}] };
        beforeEach(() => {
            $ctrl.page = 1;
            $ctrl.meta = { pagination: { total_count: 2 } };
            $ctrl.data = [contact];
            spyOn($ctrl, 'load').and.callFake(() => Promise.resolve());
        });

        it('should remove contact from data', () => {
            $ctrl.onSave({ contact: contact });
            expect($ctrl.data).toEqual([]);
        });

        it('should subtract 1 from the total_count', () => {
            $ctrl.onSave({ contact: contact });
            expect($ctrl.meta.pagination.total_count).toEqual(1);
        });

        it('should call setMeta', () => {
            spyOn($ctrl, 'setMeta').and.callThrough();
            $ctrl.onSave({ contact: contact });
            expect($ctrl.setMeta).toHaveBeenCalled();
        });

        describe('data empty', () => {
            it('should call load', () => {
                $ctrl.onSave({ contact: contact });
                expect($ctrl.load).toHaveBeenCalledWith(true, 1);
            });
        });
    });

    const apiData = [
        { addresses: [{ source: 'Sibel' }] },
        { addresses: [{ source: 'Tntmpd' }] },
        { addresses: [{ source: 'Dataserver' }] },
        { addresses: [{ source: 'Dataserver' }] }
    ];

    apiData.meta = { page: 1 };
});
