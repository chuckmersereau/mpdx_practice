import 'angular-gettext';
import { eq, get } from 'lodash/fp';
import api, { ApiService } from '../../../../common/api/api.service';
import modal, { ModalService } from '../../../../common/modal/modal.service';
import users, { UsersService } from '../../../../common/users/users.service';

class CommentController {
    comment: any;
    edit: boolean;
    onCommentRemove: any;
    taskId: string;
    constructor(
        private gettext: ng.gettext.gettextFunction,
        private api: ApiService,
        private modal: ModalService,
        private users: UsersService
    ) {
        this.edit = false;
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
            this.edit = false;
        });
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

export default angular.module('mpdx.tasks.list.drawer.comment.component', [
    'gettext',
    api, modal, users
]).component('taskItemComment', Comment).name;
