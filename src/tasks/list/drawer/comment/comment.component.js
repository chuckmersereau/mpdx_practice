import eq from 'lodash/fp/eq';
import get from 'lodash/fp/get';

class CommentController {
    constructor(
        gettext,
        api, modal, users
    ) {
        this.api = api;
        this.gettext = gettext;
        this.modal = modal;
        this.users = users;
        this.showEdit = false;
    }
    commentBelongsToUser(comment) {
        return eq(get('person.id', comment), this.users.current.id);
    }
    deleteComment() {
        const message = this.gettext('Are you sure you wish to delete the selected comment?');
        return this.modal.confirm(message).then(() => {
            return this.api.delete(`tasks/${this.taskId}/comments/${this.comment.id}`).then(() => {
                this.onCommentRemove();
            });
        });
    }
    editComment() {
        return this.api.put(`tasks/${this.taskId}/comments/${this.comment.id}`, { body: this.comment.body }).then(() => {
            this.comment.edit = false;
        });
    }
    mouseOver() {
        this.showEdit = true;
    }
    mouseOut() {
        this.showEdit = false;
    }
}

const Comment = {
    controller: CommentController,
    template: require('./comment.html'),
    bindings: {
        comment: '<',
        taskId: '<',
        onCommentRemove: '&'
    }
};

import gettextCatalog from 'angular-gettext';
import modal from 'common/modal/modal.service';
import users from 'common/users/users.service';

export default angular.module('mpdx.tasks.list.drawer.comment.component', [
    gettextCatalog,
    modal, users
]).component('taskItemComment', Comment).name;