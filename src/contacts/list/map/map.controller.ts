import 'angular-gettext';
import 'ngmap';
import { concat, defaultTo, differenceBy, each, filter, find, get, has, head, reduce } from 'lodash/fp';
import api, { ApiService } from '../../../common/api/api.service';
import contacts, { ContactsService } from '../../../contacts/contacts.service';

interface ICustomIModalScope extends mgcrea.ngStrap.modal.IModalScope {
    id: string;
}

class MapContactsController {
    iconSize: number;
    invalidAddresses: any[];
    invalidContacts: any[];
    loading: boolean;
    map: any;
    selectedAddress: any;
    selectedContact: any;
    statuses: any;
    tabId: string;
    constructor(
        private $q: ng.IQService,
        private $scope: ICustomIModalScope,
        private $window: ng.IWindowService,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private NgMap: any,
        private api: ApiService,
        private contacts: ContactsService,
        private selectedContacts: any
    ) {
        this.iconSize = new (window as any).google.maps.Size(20, 36);
        this.invalidContacts = [];
        this.invalidAddresses = [];
        this.loading = true;
        this.map = null;
        this.selectedAddress = null;
        this.selectedContact = null;
        this.statuses = {
            'Never Contacted': {
                name: this.gettextCatalog.getString('Never Contacted'),
                imageUrl: '/images/pin_never_contacted.png',
                markers: []
            },
            'Ask in Future': {
                name: this.gettextCatalog.getString('Ask in Future'),
                imageUrl: '/images/pin_ask_in_future.png',
                markers: []
            },
            'Contact for Appointment': {
                name: this.gettextCatalog.getString('Contact for Appointment'),
                imageUrl: '/images/pin_contact_for_appt.png',
                markers: []
            },
            'Appointment Scheduled': {
                name: this.gettextCatalog.getString('Appointment Scheduled'),
                imageUrl: '/images/pin_appt_scheduled.png',
                markers: []
            },
            'Call for Decision': {
                name: this.gettextCatalog.getString('Call for Decision'),
                imageUrl: '/images/pin_call_for_decision.png',
                markers: []
            },
            'Partner - Financial': {
                name: this.gettextCatalog.getString('Partner - Financial'),
                imageUrl: '/images/pin_partner_financial.png',
                markers: []
            },
            'Partner - Special': {
                name: this.gettextCatalog.getString('Partner - Special'),
                imageUrl: '/images/pin_partner_special.png',
                markers: []
            },
            'Partner - Pray': {
                name: this.gettextCatalog.getString('Partner - Pray'),
                imageUrl: '/images/pin_partner_pray.png',
                markers: []
            },
            'Cultivate Relationship': {
                name: this.gettextCatalog.getString('Cultivate Relationship'),
                imageUrl: '/images/pin_cultivate_relationship.png',
                markers: []
            },
            'All Inactive': {
                name: this.gettextCatalog.getString('All Inactive'),
                imageUrl: '/images/pin_grey.png',
                markers: []
            }
        };

        this.init();
    }
    init() {
        return this.getContacts().then((data) => {
            this.deserializeContacts(data);
            this.setMap(this.statuses);
        });
    }
    getContacts() {
        const areComplete = has('name', head(this.selectedContacts));
        return areComplete ? this.$q.resolve(this.selectedContacts) : this.fromApi();
    }
    fromApi() {
        return this.api.get({
            url: 'contacts',
            data: {
                filter: this.contacts.buildFilterParams(),
                fields: {
                    contacts: 'addresses,name,status'
                },
                include: 'addresses',
                per_page: 20000
            },
            overrideGetAsPost: true
        });
    }
    deserializeContacts(data) {
        const contacts = reduce((result, contact) => {
            contact.address = find({ primary_mailing_address: true }, contact.addresses);
            contact.invalid = !contact.address || !contact.address.geo ? true : contact.invalid;
            return concat(result, contact);
        }, [], defaultTo([], data));
        this.invalidContacts = filter({ invalid: true }, contacts);
        const mapContacts = differenceBy('id', contacts, this.invalidContacts);
        each((contact) => {
            this.createMarker(contact, contact.address);
        }, mapContacts);
    }
    createMarker(contact, address) {
        const geo = address.geo.split(',');
        const status = get(this.statusToString(contact.status), this.statuses);
        status.markers = concat(status.markers,
            new this.$window.google.maps.Marker({
                position: new this.$window.google.maps.LatLng(geo[0], geo[1]),
                icon: new this.$window.google.maps.MarkerImage(status.imageUrl, this.iconSize),
                address: address,
                contact: contact
            })
        );
    }
    setMap(statuses = {}) {
        this.loading = true;
        return this.NgMap.getMap({ id: this.$scope.id }).then((evtMap) => {
            this.map = evtMap;

            const bounds = new this.$window.google.maps.LatLngBounds();
            const MarkerClusterer = new this.$window.MarkerClusterer(this.map, [], {
                zoom: 13, gridSize: 50, imagePath: 'images/m'
            });

            each((status) => {
                each((marker) => {
                    bounds.extend(marker.getPosition());
                    marker.addListener('click', () => {
                        this.centerOnMarker(marker, false);
                    });
                    MarkerClusterer.addMarker(marker);
                }, status.markers);
            }, statuses);

            this.map.setCenter(bounds.getCenter());
            this.map.fitBounds(bounds);
            this.map.panToBounds(bounds);
            this.$window.google.maps.event.trigger(this.map, 'resize');
            this.loading = false;

            return this.map;
        });
    }
    setTab(service) {
        if (this.tabId === service) {
            this.tabId = '';
        } else {
            this.tabId = service;
        }
    }
    tabSelected(service) {
        return this.tabId === service;
    }
    statusToString(status) {
        if (has(status, this.statuses)) {
            return status;
        }
        return 'All Inactive';
    }
    centerOnMarker(marker, shiftViewport = true) {
        this.selectedAddress = marker.address;
        this.selectedContact = marker.contact;
        const status = this.statusToString(marker.contact.status);

        if (!this.tabSelected(status)) {
            this.setTab(status);
        }

        if (shiftViewport) {
            this.map.setCenter(marker.getPosition());
            this.map.setZoom(15);
        }

        // google maps doesn't preload infoWindows for parts of the map that haven't been viewed
        this.$window.setTimeout(() => {
            this.map.showInfoWindow('contact-info', marker);
        }, 200);
    }
}

export default angular.module('mpdx.contacts.list.map.controller', [
    'gettext', 'ngMap',
    api, contacts
]).controller('mapContactsController', MapContactsController).name;
