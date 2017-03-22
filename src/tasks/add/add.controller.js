import uuid from 'uuid/v1';
import moment from 'moment';
import isEmpty from 'lodash/fp/isEmpty';
import reject from 'lodash/fp/reject';

class AddTaskController {
    selectedContacts;
    contacts;
    newsletterBoth;
    newsletterEmail;
    newsletterPhysical;
    serverConstants;
    tasks;
    tasksTags;
    users;

    constructor(
        $q, $scope, $state,
        tasksTags, serverConstants, tasks, contacts, users,
        selectedContacts, specifiedAction, specifiedSubject, modalTitle
    ) {
        this.$q = $q;
        this.$scope = $scope;
        this.$state = $state;
        this.selectedContacts = selectedContacts;
        this.contacts = contacts;
        this.tasksTags = tasksTags;
        this.serverConstants = serverConstants;
        this.specifiedAction = specifiedAction;
        this.specifiedSubject = specifiedSubject;
        this.tasks = tasks;
        this.users = users;

        this.modalTitle = modalTitle;

        this.model = {
            start_at: moment().toISOString(),
            no_date: false,
            activity_type: this.specifiedAction,
            subject: this.specifiedSubject,
            notification_type: null,
            tag_list: [],
            comments: []
        };
    }
    addContact() {
        this.selectedContacts.push('');
    }
    save() {
        if (this.comment) {
            this.model.comments.push({id: uuid(), body: this.comment, person: { id: this.users.current.id }});
        }
        this.selectedContacts = reject('', this.selectedContacts); //dump empty contacts

        let promise;
        if (this.newsletter === 'both') {
            this.model.activity_type = "Newsletter - Physical";
            promise = this.tasks.create(this.model, this.selectedContacts).then(() => {
                this.model.activity_type = "Newsletter - Email";
                return this.tasks.create(this.model, this.selectedContacts);
            });
        } else if (this.newsletter === 'physical') {
            this.model.activity_type = "Newsletter - Physical";
            promise = this.tasks.create(this.model, this.selectedContacts);
        } else if (this.newsletter === 'email') {
            this.model.activity_type = "Newsletter - Email";
            promise = this.tasks.create(this.model, this.selectedContacts);
        } else if (!isEmpty(this.model.activity_type)) {
            promise = this.tasks.create(this.model, this.selectedContacts);
        } else {
            return this.$q.reject();
        }
        return promise.then(() => {
            if (this.selectedContacts.length > 0) {
                this.contacts.load(true);
            }
            this.tasksTags.load();
            this.$scope.$hide();
        });
    }
}
export default angular.module('mpdx.tasks.add.controller', [])
    .controller('addTaskController', AddTaskController).name;
