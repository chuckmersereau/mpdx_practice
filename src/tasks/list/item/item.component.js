import concat from 'lodash/fp/concat';
import eq from 'lodash/fp/eq';
import get from 'lodash/fp/get';

class ItemController {
    constructor(
        $log, gettextCatalog,
        api, locale, modal, tasks, users
    ) {
        this.$log = $log;
        this.api = api;
        this.gettextCatalog = gettextCatalog;
        this.locale = locale;
        this.modal = modal;
        this.tasks = tasks;
        this.users = users;
    }
    $onInit() {
        this.showContacts = false;
        this.showComments = false;
        this.loaded = false;
    }
    toggleContacts() {
        this.showContacts = !this.showContacts;
        if (this.showContacts && !this.loaded) {
            this.load();
        }
    }
    toggleComments() {
        this.showComments = !this.showComments;
        if (this.showComments && !this.loaded) {
            this.load();
        }
    }
    load() {
        return this.api.get(`tasks/${this.task.id}`, {
            include: 'comments,comments.person,contacts,contacts.addresses,contacts.people,contacts.people.facebook_accounts,contacts.people.phone_numbers,contacts.people.email_addresses',
            fields: {
                contacts: 'addresses,name,status,square_avatar,send_newsletter,pledge_currency_symbol,pledge_frequency,pledge_received,uncompleted_tasks_count,tag_list,pledge_amount,people',
                addresses: 'city,historic,primary_mailing_address,postal_code,state,source,street',
                email_addresses: 'email,historic,primary',
                phone_numbers: 'historic,location,number,primary',
                facebook_accounts: 'username',
                person: 'first_name,last_name,deceased,email_addresses,facebook_accounts,first_name,last_name,phone_numbers'
            }
        }).then(task => {
            this.loaded = true;
            this.task = task;
            /* istanbul ignore next */
            this.$log.debug(`tasks/${task.id}`, task);
            return task;
        });
    }
    complete() {
        this.tasks.completeModal(this.task);
    }
    star() {
        return this.tasks.star(this.task).then((data) => {
            this.task.starred = data.starred;
        });
    }
    edit() {
        this.tasks.editModal(this.task);
    }
    delete() {
        this.tasks.delete(this.task);
    }
    addComment() {
        if (this.comment) {
            return this.api.post(`tasks/${this.task.id}/comments`, { body: this.comment, person: { id: this.users.current.id } }).then(data => {
                data.person = {
                    id: this.users.current.id,
                    first_name: this.users.current.first_name,
                    last_name: this.users.current.last_name
                };
                this.task.comments = concat(this.task.comments, data);
                this.comment = '';
            });
        }
    }
    editComment(comment) {
        return this.api.put(`tasks/${this.task.id}/comments/${comment.id}`, { body: comment.body }).then(() => {
            comment.edit = false;
        });
    }
    deleteComment(comment) {
        const message = this.gettextCatalog.getString('Are you sure you wish to delete the selected comment?');
        this.modal.confirm(message).then(() => {
            this.tasks.deleteComment(this.task, comment);
        });
    }
    commentBelongsToUser(comment) {
        return eq(get('person.id', comment), this.users.current.id);
    }
}

const Item = {
    controller: ItemController,
    template: require('./item.html'),
    bindings: {
        selected: '<',
        task: '<'
    }
};

import contacts from 'contacts/contacts.service';
import tasks from 'tasks/tasks.service';

export default angular.module('mpdx.tasks.list.item.component', [
    contacts, tasks
]).component('tasksListItem', Item).name;
