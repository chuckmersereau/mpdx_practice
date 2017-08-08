import concat from 'lodash/fp/concat';
import each from 'lodash/fp/each';
import filter from 'lodash/fp/filter';
import isEmpty from 'lodash/fp/isEmpty';
import isNil from 'lodash/fp/isNil';
import map from 'lodash/fp/map';
import reduce from 'lodash/fp/reduce';

class MapContactsController {
    constructor(
        $window,
        NgMap,
        selectedContacts
    ) {
        this.$window = $window;
        this.NgMap = NgMap;
        this.selectedContacts = selectedContacts;

        this.noContactCount = 0;
        this.markerClusterer = null;
        this.iconSize = new window.google.maps.Size(20, 36);

        this.activate();
    }
    activate() {
        const addresses = reduce((result, contact) => {
            let primaryAddresses = filter(address =>
                address.primary_mailing_address === true && !isNil(address.geo) && !isEmpty(address.geo)
            , contact.addresses);
            primaryAddresses = reduce((res, val) => {
                val.contactName = contact.name;
                val.contactStatus = contact.status;
                return concat(result, val);
            }, [], primaryAddresses);
            return concat(result, primaryAddresses);
        }, [], this.selectedContacts);
        const markers = map(address => {
            const geoSplit = address.geo.split(',');
            const position = new this.$window.google.maps.LatLng(geoSplit[0], geoSplit[1]);
            const url = this.markerURL(address.contactStatus);
            const icon = new this.$window.google.maps.MarkerImage(url, this.iconSize);
            return new this.$window.google.maps.Marker({ position: position, title: address.contactName, icon: icon });
        }, addresses);
        this.NgMap.getMap().then((evtMap) => {
            this.markerClusterer = new this.$window.MarkerClusterer(evtMap, markers, {imagePath: 'images/m'});
            let bounds = new this.$window.google.maps.LatLngBounds();
            each(marker => {
                bounds.extend(marker.getPosition());
            }, markers);
            evtMap.setCenter(bounds.getCenter());
            if (markers.length > 1) {
                evtMap.fitBounds(bounds);
            }

            this.$window.google.maps.event.trigger(evtMap, 'resize');
        });
    }
    markerURL(statusToMark) {
        const base = '/images/';
        switch (statusToMark) {
            case '':
            case 'Never Contacted':
                return base + 'pin_never_contacted.png';
            case 'Ask in Future':
                return base + 'pin_ask_in_future.png';
            case 'Contact for Appointment':
                return base + 'pin_contact_for_appt.png';
            case 'Appointment Scheduled':
                return base + 'pin_appt_scheduled.png';
            case 'Call for Decision':
                return base + 'pin_call_for_decision.png';
            case 'Partner - Financial':
                return base + 'pin_partner_financial.png';
            case 'Partner - Special':
                return base + 'pin_partner_special.png';
            case 'Partner - Pray':
                return base + 'pin_partner_pray.png';
            case 'Cultivate Relationship':
                return base + 'pin_cultivate_relationship.png';
        }
        return base + 'pin_grey.png';
    }
}

export default angular.module('mpdx.contacts.filter.mapContacts.controller', [])
    .controller('mapContactsController', MapContactsController).name;
