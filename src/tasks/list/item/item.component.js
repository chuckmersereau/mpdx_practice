import join from 'lodash/fp/join';
import map from 'lodash/fp/map';
import take from 'lodash/fp/take';

class ItemController {
    task;
    constructor(
        gettextCatalog,
        locale, modal, tasks, users
    ) {
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
        this.tasks.get(this.task.id, false).then((task) => {
            this.loaded = true;
            this.task = task;
        });
    }
    complete() {
        this.tasks.completeModal(this.task);
    }
    star() {
        return this.tasks.star(this.task).then((data) => {
            this.task.starred = data.starred;
            this.task.updated_in_db_at = data.updated_in_db_at;
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
            this.tasks.addComment(this.task, this.comment);
            this.comment = '';
        }
    }
    deleteComment(comment) {
        const message = this.gettextCatalog.getString('Are you sure you wish to delete the selected comment?');
        this.modal.confirm(message).then(() => {
            this.tasks.deleteComment(this.task, comment);
        });
    }
    commentBelongsToUser(comment) {
        return comment.person.id === this.users.current.id;
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

export default angular.module('mpdx.tasks.list.item.component', [])
    .component('tasksListItem', Item).name;
