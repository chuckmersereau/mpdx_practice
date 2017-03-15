import find from 'lodash/fp/find';
import first from 'lodash/fp/first';
import get from 'lodash/fp/get';
import reduce from 'lodash/fp/reduce';

const iconSize = new window.google.maps.Size(20, 36);

class MapContactsController {
    selectedContacts;
    constructor(
        $window, $timeout,
        NgMap,
        selectedContacts
    ) {
        this.$timeout = $timeout;
        this.$window = $window;
        this.NgMap = NgMap;
        this.selectedContacts = selectedContacts;

        this.noContactCount = 0;

        this.activate();
    }
    activate() {
        this.$timeout(() => this.mapContacts(), 1000);
    }
    generateContactMarker(contact, evtMap) {
        const geo = get('geo', find({ primary_mailing_address: true }, contact.addresses));
        if (geo) {
            const geoSplit = geo.split(',');
            const position = new this.$window.google.maps.LatLng(geoSplit[0], geoSplit[1]);
            const url = this.markerURL(contact.status);

            const icon = new this.$window.google.maps.MarkerImage(url, iconSize);
            return new this.$window.google.maps.Marker({
                position: position,
                map: evtMap,
                title: `${contact.name}`,
                icon: icon
            });
        }
        return null;
    }
    markerURL(statusToMark) {
        const base = 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|';
        switch (statusToMark) {
            case '':
            case 'Never Contacted':
                return base + 'dcdcdc';
            case 'Ask in Future':
                return base + 'F04141';
            case 'Contact for Appointment':
                return base + 'F0D541';
            case 'Appointment Scheduled':
                return base + '54DB1A';
            case 'Call for Decision':
                return base + '41F0A1';
            case 'Partner - Financial':
                return base + '41AAF0';
            case 'Partner - Special':
                return base + '6C41F0';
            case 'Partner - Pray':
                return base + 'F26FE5';
            case 'Cultivate Relationship':
                return base + 'cf641e';
        }

        return base + '757575';
    }
    mapContacts() {
        this.NgMap.getMap().then((evtMap) => {
            this.newMarkers = reduce((result, contact) => {
                const marker = this.generateContactMarker(contact, evtMap);
                if (marker) {
                    result.push(marker);
                }
                return result;
            }, [], this.selectedContacts);
            this.noContactCount = this.selectedContacts.length - this.newMarkers.length;
            this.$window.google.maps.event.trigger(evtMap, 'resize');
            const firstPosition = get('position', first(this.newMarkers));
            if (firstPosition) {
                this.loaded = true;
                evtMap.setCenter(this.newMarkers[0].position);
            }
            this.$window.google.maps.event.trigger(evtMap, 'resize');
        });
    }
}

export default angular.module('mpdx.contacts.filter.mapContacts.controller', [])
    .controller('mapContactsController', MapContactsController).name;
