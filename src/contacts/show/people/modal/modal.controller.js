import uuid from 'uuid/v1';

class PersonModalController {
    contact;
    people;
    contacts;

    constructor(
        $log, $rootScope, $scope,
        people, contact, person
    ) {
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.people = people;
        this.contact = contact;
        this.person = person;
        this.$scope = $scope;
        this.personDetails = '';
        this.maps = [];
        this.activeTab = 'contact-info';

        this.activate();
    }
    activate() {
        if (_.has(this.person, 'id')) {
            this.modalTitle = 'Edit Person';
            //bad data is bad
            if (this.person.birthday_year) {
                this.person.birthday = moment(`${this.person.birthday_year}-${this.person.birthday_month}-${this.person.birthday_day}`, 'YYYY-MM-DD').toDate();
                console.log(this.person.birthday);
            }
            if (this.person.anniversary_year) {
                this.person.anniversary = moment(`${this.person.anniversary_year}-${this.person.anniversary_month}-${this.person.anniversary_day}`, 'YYYY-MM-DD').toDate();
            }
        } else {
            this.modalTitle = 'Add Person';
            this.person = {
                email_addresses: [],
                phone_numbers: [],
                family_relationships: [],
                networks: []
            };
        }
    }
    save() {
        //bad data is bad
        if (this.person.birthday) {
            const birthday = moment(this.person.birthday);
            this.person.birthday_year = birthday.year();
            this.person.birthday_month = birthday.month() + 1;
            this.person.birthday_day = birthday.date();
        }
        if (this.person.anniversary) {
            const anniversary = moment(this.person.anniversary);
            this.person.anniversary_year = anniversary.year();
            this.person.anniversary_month = anniversary.month() + 1;
            this.person.anniversary_day = anniversary.date();
        }

        if (_.has(this.person, 'id')) {
            return this.people.save(this.contact.id, this.person).then(() => {
                this.$log.debug('person saved:', this.person);
                this.$rootScope.$emit('peopleUpdated', this.contact.id);

                this.$scope.$hide();
            });
        } else {
            return this.people.create(this.contact.id, this.person).then(() => {
                this.$log.debug('person created:', this.person);
                this.$rootScope.$emit('peopleUpdated', this.contact.id);
                this.$scope.$hide();
            });
        }
    }
    remove(property, index) {
        this.person[property].splice(index, 1);
    }
    addEmailAddress() {
        this.person.email_addresses.push({id: uuid(), email: '', location: ''});
    }
    addPhone() {
        this.person.phone_numbers.push({id: uuid(), number: '', location: ''});
    }
    addFamilyRelationship() {
        this.person.family_relationships.push({id: uuid(), related_person: {id: null}});
    }
    addFacebook() {
        this.person.facebook_accounts.push({id: uuid(), username: ''});
    }
    addTwitter() {
        this.person.twitter_accounts.push({id: uuid(), screen_name: ''});
    }
    addLinkedin() {
        this.person.linkedin_accounts.push({id: uuid(), username: ''});
    }
    changePrimary(property, index) {
        _.forEach(this.person[property], (person, i) => {
            if (i === index) {
                person.primary = true;
            } else {
                person.primary = false;
            }
        });
    }
    changeHistoric(obj) {
        obj.historic = !obj.historic;
    }
    delete() {
        this.person._destroy = 1;
        return this.save();
    }
}

export default angular.module('mpdx.contacts.show.personModal.controller', [])
    .controller('personModalController', PersonModalController).name;
