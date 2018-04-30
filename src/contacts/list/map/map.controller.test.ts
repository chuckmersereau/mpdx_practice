import mapController from './map.controller';

let contactList = [
    {
        id: 1,
        name: 'a',
        addresses: [
            {
                primary_mailing_address: true,
                geo: '123,456'
            }
        ]
    }, {
        id: 2,
        name: 'b',
        addresses: [
            {
                primary_mailing_address: true,
                geo: null
            }, {
                primary_mailing_address: true
            }
        ]
    }, {
        id: 3
    }
];

xdescribe('contacts.list.map.controller', () => {
    let $ctrl, controller, scope, _window, gettextCatalog, NgMap, map, markerClusterer, bounds, api, contacts, q;
    beforeEach(() => {
        angular.mock.module(mapController);
        inject(($controller, $rootScope, $window, _gettextCatalog_, _NgMap_, _api_, _contacts_, $q) => {
            scope = $rootScope.$new();
            scope.$hide = () => {};
            api = _api_;
            contacts = _contacts_;
            controller = $controller;
            _window = $window;
            gettextCatalog = _gettextCatalog_;
            NgMap = _NgMap_;
            q = $q;
            bounds = {
                getCenter: () => {},
                extend: () => {}
            };
            _window.google = {
                maps: {
                    Size: () => {},
                    LatLng: () => {},
                    MarkerImage: () => {},
                    Marker: () => {},
                    LatLngBounds: () => bounds,
                    event: {
                        trigger: () => {}
                    }
                }
            };
            markerClusterer = {
                addMarker: () => {}
            };
            _window.MarkerClusterer = () => markerClusterer;
            $ctrl = loadController();
        });
    });

    function loadController() {
        map = {
            setCenter: () => {},
            fitBounds: () => {},
            panToBounds: () => {},
            showInfoWindow: () => {}
        };

        spyOn(NgMap, 'getMap').and.callFake(() => q.resolve(map));

        return controller('mapContactsController as $ctrl', {
            $scope: scope,
            selectedContacts: contactList
        });
    }
    describe('constructor', () => {
        it('should set default values', () => {
            expect($ctrl.invalidContacts).toEqual(jasmine.any(Array));
            expect($ctrl.invalidAddresses).toEqual(jasmine.any(Array));
            expect($ctrl.statuses).toEqual({
                'Never Contacted': {
                    name: gettextCatalog.getString('Never Contacted'),
                    imageUrl: '/images/pin_never_contacted.png',
                    markers: []
                },
                'Ask in Future': {
                    name: gettextCatalog.getString('Ask in Future'),
                    imageUrl: '/images/pin_ask_in_future.png',
                    markers: []
                },
                'Contact for Appointment': {
                    name: gettextCatalog.getString('Contact for Appointment'),
                    imageUrl: '/images/pin_contact_for_appt.png',
                    markers: []
                },
                'Appointment Scheduled': {
                    name: gettextCatalog.getString('Appointment Scheduled'),
                    imageUrl: '/images/pin_appt_scheduled.png',
                    markers: []
                },
                'Call for Decision': {
                    name: gettextCatalog.getString('Call for Decision'),
                    imageUrl: '/images/pin_call_for_decision.png',
                    markers: []
                },
                'Partner - Financial': {
                    name: gettextCatalog.getString('Partner - Financial'),
                    imageUrl: '/images/pin_partner_financial.png',
                    markers: []
                },
                'Partner - Special': {
                    name: gettextCatalog.getString('Partner - Special'),
                    imageUrl: '/images/pin_partner_special.png',
                    markers: []
                },
                'Partner - Pray': {
                    name: gettextCatalog.getString('Partner - Pray'),
                    imageUrl: '/images/pin_partner_pray.png',
                    markers: []
                },
                'Cultivate Relationship': {
                    name: gettextCatalog.getString('Cultivate Relationship'),
                    imageUrl: '/images/pin_cultivate_relationship.png',
                    markers: []
                },
                'All Inactive': {
                    name: gettextCatalog.getString('All Inactive'),
                    imageUrl: '/images/pin_grey.png',
                    markers: jasmine.any(Array)
                }
            });
            expect($ctrl.iconSize).toEqual(new (window as any).google.maps.Size(20, 36));
            expect($ctrl.map).toEqual(null);
            expect($ctrl.selectedAddress).toEqual(null);
            expect($ctrl.selectedContact).toEqual(null);
            expect($ctrl.loading).toEqual(true);
        });
    });

    describe('init', () => {
        beforeEach(() => {
            spyOn($ctrl, 'deserializeContacts').and.callFake(() => {});
            spyOn($ctrl, 'setMap').and.callFake(() => {});
            spyOn($ctrl, 'getContacts').and.callFake(() => q.resolve());
        });

        it('should call getContacts', (done) => {
            $ctrl.init().then(() => {
                expect($ctrl.getContacts).toHaveBeenCalled();
                done();
            });
            scope.$digest();
        });
        it('should call deserializeContacts', (done) => {
            $ctrl.init().then(() => {
                expect($ctrl.deserializeContacts).toHaveBeenCalled();
                done();
            });
            scope.$digest();
        });

        it('should call setMap', (done) => {
            $ctrl.init().then(() => {
                expect($ctrl.setMap).toHaveBeenCalled();
                done();
            });
            scope.$digest();
        });
    });
    describe('getContacts', () => {
        beforeEach(() => {
            spyOn(api, 'get').and.callFake(() => q.resolve());
            spyOn(contacts, 'buildFilterParams').and.callFake(() => 'bfp');
            spyOn($ctrl, 'createMarker').and.callFake(() => 'bm');
        });
        it('shouldn\'t call the api', (done) => {
            $ctrl.getContacts().then(() => {
                expect(api.get).not.toHaveBeenCalled();
                done();
            });
            scope.$digest();
        });
        it('should call the api when no data is present', (done) => {
            $ctrl.selectedContacts = [{ id: 1 }, { id: 2 }];
            $ctrl.getContacts().then(() => {
                expect(api.get).toHaveBeenCalledWith({
                    url: 'contacts',
                    data: {
                        filter: 'bfp',
                        fields: {
                            contacts: 'addresses,name,status'
                        },
                        include: 'addresses',
                        per_page: 20000
                    },
                    overrideGetAsPost: true
                });
                done();
            });
            scope.$digest();
        });
    });

    describe('deserializeContacts', () => {
        it('should deserialize contacts into statuses, invalidContacts, invalidAddresses', () => {
        });
    });

    describe('createMarker', () => {
        let contact, address;
        beforeEach(() => {
            contact = {
                status: 'Cultivate Relationship'
            };
            address = {
                geo: '123,456'
            };
        });

        it('should create marker', () => {
            spyOn($ctrl.$window.google.maps, 'Marker').and.callThrough();
            $ctrl.createMarker(contact, address);
            expect($ctrl.$window.google.maps.Marker).toHaveBeenCalledWith({
                position: jasmine.any(Object),
                icon: jasmine.any(Object),
                address: address,
                contact: contact
            });
        });

        it('should call maps.LatLng', () => {
            spyOn($ctrl.$window.google.maps, 'LatLng').and.callThrough();
            $ctrl.createMarker(contact, address);
            expect($ctrl.$window.google.maps.LatLng).toHaveBeenCalledWith('123', '456');
        });

        it('should call maps.MarkerImage', () => {
            spyOn($ctrl.$window.google.maps, 'MarkerImage').and.callThrough();
            $ctrl.createMarker(contact, address);
            expect($ctrl.$window.google.maps.MarkerImage).toHaveBeenCalledWith(
                '/images/pin_cultivate_relationship.png',
                jasmine.any(Object)
            );
        });

        it('should push marker into status.markers array', () => {
            $ctrl.createMarker(contact, address);
            expect($ctrl.statuses['Cultivate Relationship'].markers[0]).toEqual(jasmine.any(Object));
        });
    });

    describe('setMap', () => {
        beforeEach(() => {
            spyOn($ctrl.$window.google.maps, 'LatLngBounds').and.callThrough();
            spyOn($ctrl.$window.google.maps.event, 'trigger').and.callThrough();
            spyOn($ctrl.$window, 'MarkerClusterer').and.callThrough();
            spyOn(map, 'setCenter').and.callThrough();
            spyOn(map, 'fitBounds').and.callThrough();
            spyOn(map, 'panToBounds').and.callThrough();
        });
        it('should return promise', () => {
            expect($ctrl.setMap()).toEqual(jasmine.any(q));
        });

        it('should set loading to true', () => {
            $ctrl.setMap();
            expect($ctrl.loading).toEqual(true);
        });

        describe('promise successful', () => {
            it('should store data into map', (done) => {
                $ctrl.setMap().then((data) => {
                    expect($ctrl.map).toEqual(data);
                    done();
                });
                scope.$digest();
            });

            it('should call maps.LatLngBounds', (done) => {
                $ctrl.setMap().then(() => {
                    expect($ctrl.$window.google.maps.LatLngBounds).toHaveBeenCalled();
                    done();
                });
                scope.$digest();
            });

            it('should call MarkerClusterer', (done) => {
                $ctrl.setMap().then((data) => {
                    expect($ctrl.$window.MarkerClusterer).toHaveBeenCalledWith(data, [], {
                        zoom: 13, gridSize: 50, imagePath: 'images/m'
                    });
                    done();
                });
                scope.$digest();
            });

            it('should call map.setCenter', (done) => {
                $ctrl.setMap().then(() => {
                    expect(map.setCenter).toHaveBeenCalled();
                    done();
                });
                scope.$digest();
            });

            it('should call map.fitBounds', (done) => {
                $ctrl.setMap().then(() => {
                    expect(map.fitBounds).toHaveBeenCalled();
                    done();
                });
                scope.$digest();
            });

            it('should call map.panToBounds', (done) => {
                $ctrl.setMap().then(() => {
                    expect(map.panToBounds).toHaveBeenCalled();
                    done();
                });
                scope.$digest();
            });

            it('should call event.trigger', (done) => {
                $ctrl.setMap().then((data) => {
                    expect($ctrl.$window.google.maps.event.trigger).toHaveBeenCalledWith(data, 'resize');
                    done();
                });
                scope.$digest();
            });

            it('should set loading to false', (done) => {
                $ctrl.setMap().then(() => {
                    expect($ctrl.loading).toEqual(false);
                    done();
                });
                scope.$digest();
            });

            describe('statuses set', () => {
                let statuses, marker1, marker2;

                beforeEach(() => {
                    marker1 = {
                        getPosition: () => {},
                        addListener: () => {}
                    };
                    marker2 = {
                        getPosition: () => {},
                        addListener: () => {}
                    };
                    statuses = {
                        'Partner - Special': {
                            markers: [marker1]
                        },
                        'Cultivate Relationship': {
                            markers: [marker2]
                        }
                    };
                });

                it('should call bounds.extend', (done) => {
                    spyOn(bounds, 'extend').and.callThrough();
                    spyOn(marker1, 'getPosition').and.returnValue(0.5);
                    spyOn(marker2, 'getPosition').and.returnValue(1);
                    $ctrl.setMap(statuses).then(() => {
                        expect(bounds.extend).toHaveBeenCalledWith(0.5);
                        expect(bounds.extend).toHaveBeenCalledWith(1);
                        done();
                    });
                    scope.$digest();
                });

                it('should call marker.getPosition', (done) => {
                    spyOn(marker1, 'getPosition').and.callThrough();
                    spyOn(marker2, 'getPosition').and.callThrough();
                    $ctrl.setMap(statuses).then(() => {
                        expect(marker1.getPosition).toHaveBeenCalled();
                        expect(marker2.getPosition).toHaveBeenCalled();
                        done();
                    });
                    scope.$digest();
                });

                it('should call marker.addListener', (done) => {
                    spyOn(marker1, 'addListener').and.callThrough();
                    spyOn(marker2, 'addListener').and.callThrough();
                    $ctrl.setMap(statuses).then(() => {
                        expect(marker1.addListener).toHaveBeenCalledWith('click', jasmine.any(Function));
                        expect(marker2.addListener).toHaveBeenCalledWith('click', jasmine.any(Function));
                        done();
                    });
                    scope.$digest();
                });

                it('should call MarkerClusterer.addMarker', (done) => {
                    spyOn(markerClusterer, 'addMarker').and.callThrough();
                    $ctrl.setMap(statuses).then(() => {
                        expect(markerClusterer.addMarker).toHaveBeenCalledWith(marker1);
                        expect(markerClusterer.addMarker).toHaveBeenCalledWith(marker2);
                        done();
                    });
                    scope.$digest();
                });
            });
        });
    });

    describe('setTab', () => {
        describe('tabId is tab being selected', () => {
            it('should set tabId to empty string', () => {
                $ctrl.tabId = 'impersonate_user';
                $ctrl.setTab('impersonate_user');
                expect($ctrl.tabId).toEqual('');
            });
        });

        describe('tabId is not tab being selected', () => {
            it('should set tabId to tab being selected', () => {
                $ctrl.setTab('offline_organization');
                expect($ctrl.tabId).toEqual('offline_organization');
            });
        });
    });

    describe('tabSelected', () => {
        describe('tabId is tab being queried', () => {
            it('should return true', () => {
                $ctrl.tabId = 'impersonate_user';
                expect($ctrl.tabSelected('impersonate_user')).toEqual(true);
            });
        });

        describe('tabId is not tab being queried', () => {
            it('should return false', () => {
                $ctrl.tabId = 'impersonate_user';
                expect($ctrl.tabSelected('other_setting')).toEqual(false);
            });
        });
    });

    describe('statusToString', () => {
        describe('status is valid', () => {
            it('should return status', () => {
                expect($ctrl.statusToString('Appointment Scheduled')).toEqual('Appointment Scheduled');
            });
        });
        describe('status is invalid', () => {
            it('should return All Inactive', () => {
                expect($ctrl.statusToString('Test Test')).toEqual('All Inactive');
            });
        });
    });

    describe('centerOnMarker', () => {
        let marker;

        beforeEach(() => {
            marker = {
                contact: { id: 'contact_id', status: 'Appointment Scheduled' },
                address: { id: 'address_id' },
                getPosition: () => '20,20'
            };
            $ctrl.map = {
                setCenter: () => {},
                setZoom: () => {},
                showInfoWindow: () => {}
            };
        });

        it('should set selectedAddress', () => {
            $ctrl.centerOnMarker(marker);
            expect($ctrl.selectedAddress).toEqual(marker.address);
        });

        it('should set selectedContact', () => {
            $ctrl.centerOnMarker(marker);
            expect($ctrl.selectedContact).toEqual(marker.contact);
        });

        describe('tab selected is marker.contact.status', () => {
            it('should call tabSelected', () => {
                spyOn($ctrl, 'tabSelected').and.returnValue(true);
                $ctrl.centerOnMarker(marker);
                expect($ctrl.tabSelected).toHaveBeenCalledWith(marker.contact.status);
            });

            it('should not call setTab', () => {
                spyOn($ctrl, 'tabSelected').and.returnValue(true);
                spyOn($ctrl, 'setTab').and.callFake(() => {});
                $ctrl.centerOnMarker(marker);
                expect($ctrl.setTab).not.toHaveBeenCalledWith(marker.contact.status);
            });
        });

        describe('tab selected is not marker.contact.status', () => {
            it('should call tabSelected', () => {
                spyOn($ctrl, 'tabSelected').and.returnValue(false);
                $ctrl.centerOnMarker(marker);
                expect($ctrl.tabSelected).toHaveBeenCalledWith(marker.contact.status);
            });

            it('should call setTab', () => {
                spyOn($ctrl, 'tabSelected').and.returnValue(false);
                spyOn($ctrl, 'setTab').and.callFake(() => {});
                $ctrl.centerOnMarker(marker);
                expect($ctrl.setTab).toHaveBeenCalledWith(marker.contact.status);
            });
        });

        describe('shiftViewport is true', () => {
            it('should call marker.getPosition', () => {
                spyOn(marker, 'getPosition');
                $ctrl.centerOnMarker(marker, true);
                expect(marker.getPosition).toHaveBeenCalled();
            });

            it('should call map.setCenter', () => {
                spyOn($ctrl.map, 'setCenter');
                $ctrl.centerOnMarker(marker, true);
                expect($ctrl.map.setCenter).toHaveBeenCalledWith('20,20');
            });

            it('should call map.setZoom', () => {
                spyOn($ctrl.map, 'setZoom');
                $ctrl.centerOnMarker(marker, true);
                expect($ctrl.map.setZoom).toHaveBeenCalledWith(15);
            });
        });
    });
});
