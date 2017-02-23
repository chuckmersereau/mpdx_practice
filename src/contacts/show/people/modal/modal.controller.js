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
    addEmailAddress() {
        this.person.email_addresses.push(this.emailObject());
    }
    emailObject() {
        return {id: uuid(), email: '', location: ''};
    }
    removeEmailAddress(index) {
        this.person.email_addresses.splice(index, 1);
    }
    addPhone() {
        this.person.phone_numbers.push(this.phoneObject());
    }

    phoneObject() {
        return {id: uuid(), number: '', location: ''};
    }
    removePhone(index) {
        this.person.phone_numbers.splice(index, 1);
    }
    addFamilyRelationship() {
        this.person.family_relationships.push(this.familyRelationshipObject());
    }
    familyRelationshipObject() {
        return {id: uuid(), related_person: {id: null}};
    }
    removeFamilyRelationship(index) {
        this.person.family_relationships.splice(index, 1);
    }
    addFacebook() {
        this.person.facebook_accounts.push(this.facebookObject());
    }
    facebookObject() {
        return {id: uuid(), username: ''};
    }
    removeFacebook(index) {
        this.person.facebook_accounts.splice(index, 1);
    }
    addTwitter() {
        this.person.twitter_accounts.push(this.twitterObject());
    }
    twitterObject() {
        return {id: uuid(), screen_name: ''};
    }
    removeTwitter(index) {
        this.person.twitter_accounts.splice(index, 1);
    }
    delete() {
        this.person._destroy = 1;
        return this.save();
    }
}

export default angular.module('mpdx.contacts.show.personModal.controller', [])
    .controller('personModalController', PersonModalController).name;
