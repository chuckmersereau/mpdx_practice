class MapContactsController {
    selectedContacts;
    constructor(
        $window, $timeout, selectedContacts
    ) {
        this.$timeout = $timeout;
        this.$window = $window;
        this.selectedContacts = selectedContacts;

        this.activate();
    }
    activate() {
        this.$timeout(this.mapContacts.bind(this), 1000);
    }
    generateContactMarker(contact) {
        const cc = contact;
        let marker;
        if (cc && cc.addresses && cc.addresses.length > 0) {
            const geo = cc.addresses[0].geo;
            if (geo) {
                marker = {
                    'lat': geo.split(',')[0],
                    'lng': geo.split(',')[1],
                    'infowindow': `<a href="/selectedContacts/${contact.id}">${contact.name}</a>`,
                    'picture': {
                        'url': this.markerURL(contact.status),
                        'width': 20,
                        'height': 36
                    }
                };
            }
        }

        return marker;
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
        const newMarkers = [];
        const contactsCounts = {
            noAddress: 0
        };
        angular.forEach(this.selectedContacts, (contact) => {
            const marker = this.generateContactMarker(contact);
            if (marker) {
                newMarkers.push(marker);
            } else {
                contactsCounts.noAddress += 1;
            }
        });
        // angular.element('#contacts_map_modal').dialog({ width: 750, height: 615 });
        const addMarkers = () => {
            this.mapHandler.removeMarkers(this.mapMarkers);
            this.mapMarkers = this.mapHandler.addMarkers(newMarkers);
            this.mapHandler.bounds.extendWith(this.mapMarkers);
            this.mapHandler.fitMapToBounds();
        };
        this.singleMap(addMarkers.bind(this));
        angular.element('.contacts_counts').text(contactsCounts.noAddress + '/' + this.selectedContacts.length);
    }
    singleMap(callback) {
        let methodToExec = callback;
        if (angular.isFunction(methodToExec)) {
            methodToExec = _.noop;
        }
        const mapOptions = {streetViewControl: false};
        if (this.mapHandler) {
            methodToExec();
        } else {
            this.mapHandler = this.$window.Gmaps.build('Google');
            this.mapHandler.buildMap(
                {
                    provider: mapOptions,
                    internal: { id: 'contacts-map' }
                },
                methodToExec.bind(this)
            );
        }
    }
}

export default angular.module('mpdx.contacts.filter.mapContacts.controller', [])
    .controller('mapContactsController', MapContactsController).name;
