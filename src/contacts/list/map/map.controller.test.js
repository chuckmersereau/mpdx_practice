import mapController from './map.controller';

let contactList = [
    {
        id: 1,
        addresses: [
            {
                primary_mailing_address: true,
                geo: '123,456'
            }
        ]
    }, {
        id: 2,
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

describe('contacts.list.map.controller', () => {
    let $ctrl, controller, scope, _window, gettextCatalog, NgMap, map, markerClusterer, bounds;
    beforeEach(() => {
        angular.mock.module(mapController);
        inject(($controller, $rootScope, $window, _gettextCatalog_, _NgMap_) => {
            scope = $rootScope.$new();
            scope.$hide = () => {};
            controller = $controller;
            _window = $window;
            gettextCatalog = _gettextCatalog_;
            NgMap = _NgMap_;
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

        spyOn(NgMap, 'getMap').and.callFake(() => Promise.resolve(map));

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
            expect($ctrl.iconSize).toEqual(new window.google.maps.Size(20, 36));
            expect($ctrl.map).toEqual(null);
            expect($ctrl.selectedAddress).toEqual(null);
            expect($ctrl.selectedContact).toEqual(null);
            expect($ctrl.loading).toEqual(true);
        });
    });

    describe('$onInit', () => {
        beforeEach(() => {
            spyOn($ctrl, 'deserializeContacts').and.returnValue();
            spyOn($ctrl, 'setMap').and.returnValue();
        });

        it('should call deserializeContacts', () => {
            $ctrl.$onInit();
            expect($ctrl.deserializeContacts).toHaveBeenCalled();
        });

        it('should call setMap', () => {
            $ctrl.$onInit();
            expect($ctrl.setMap).toHaveBeenCalled();
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
        it('should return promise', () => {
            expect($ctrl.setMap()).toEqual(jasmine.any(Promise));
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
            });

            it('should call maps.LatLngBounds', (done) => {
                spyOn($ctrl.$window.google.maps, 'LatLngBounds').and.callThrough();
                $ctrl.setMap().then(() => {
                    expect($ctrl.$window.google.maps.LatLngBounds).toHaveBeenCalled();
                    done();
                });
            });

            it('should call MarkerClusterer', (done) => {
                spyOn($ctrl.$window, 'MarkerClusterer').and.callThrough();
                $ctrl.setMap().then((data) => {
                    expect($ctrl.$window.MarkerClusterer).toHaveBeenCalledWith(data, [], {
                        zoom: 13, gridSize: 50, imagePath: 'images/m'
                    });
                    done();
                });
            });

            it('should call map.setCenter', (done) => {
                spyOn(map, 'setCenter').and.callThrough();
                $ctrl.setMap().then(() => {
                    expect(map.setCenter).toHaveBeenCalled();
                    done();
                });
            });

            it('should call map.fitBounds', (done) => {
                spyOn(map, 'fitBounds').and.callThrough();
                $ctrl.setMap().then(() => {
                    expect(map.fitBounds).toHaveBeenCalled();
                    done();
                });
            });

            it('should call map.panToBounds', (done) => {
                spyOn(map, 'panToBounds').and.callThrough();
                $ctrl.setMap().then(() => {
                    expect(map.panToBounds).toHaveBeenCalled();
                    done();
                });
            });

            it('should call event.trigger', (done) => {
                spyOn($ctrl.$window.google.maps.event, 'trigger').and.callThrough();
                $ctrl.setMap().then((data) => {
                    expect($ctrl.$window.google.maps.event.trigger).toHaveBeenCalledWith(data, 'resize');
                    done();
                });
            });

            it('should set loading to false', (done) => {
                $ctrl.setMap().then(() => {
                    expect($ctrl.loading).toEqual(false);
                    done();
                });
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
                });

                it('should call marker.getPosition', (done) => {
                    spyOn(marker1, 'getPosition').and.callThrough();
                    spyOn(marker2, 'getPosition').and.callThrough();
                    $ctrl.setMap(statuses).then(() => {
                        expect(marker1.getPosition).toHaveBeenCalled();
                        expect(marker2.getPosition).toHaveBeenCalled();
                        done();
                    });
                });

                it('should call marker.addListener', (done) => {
                    spyOn(marker1, 'addListener').and.callThrough();
                    spyOn(marker2, 'addListener').and.callThrough();
                    $ctrl.setMap(statuses).then(() => {
                        expect(marker1.addListener).toHaveBeenCalledWith('click', jasmine.any(Function));
                        expect(marker2.addListener).toHaveBeenCalledWith('click', jasmine.any(Function));
                        done();
                    });
                });

                it('should call MarkerClusterer.addMarker', (done) => {
                    spyOn(markerClusterer, 'addMarker').and.callThrough();
                    $ctrl.setMap(statuses).then(() => {
                        expect(markerClusterer.addMarker).toHaveBeenCalledWith(marker1);
                        expect(markerClusterer.addMarker).toHaveBeenCalledWith(marker2);
                        done();
                    });
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
                spyOn($ctrl, 'setTab').and.returnValue();
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
                spyOn($ctrl, 'setTab').and.returnValue();
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
