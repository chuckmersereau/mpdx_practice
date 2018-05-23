import tasks, { TasksService } from '../..//tasks.service';

class NewsletterTaskController {
    comment: string;
    task: any;
    constructor(
        private $scope: mgcrea.ngStrap.modal.IModalScope,
        private tasks: TasksService
    ) {
        this.$scope = $scope;
        this.tasks = tasks;

        this.task = { completed: true, activity_type: 'Newsletter - Both' };
    }
    save() {
        let task = angular.copy(this.task);
        if (task.activity_type === 'Newsletter - Both') {
            task.activity_type = 'Newsletter - Physical';
            return this.tasks.create(task, [], this.comment).then(() => {
                task = angular.copy(this.task);
                task.activity_type = 'Newsletter - Email';
                return this.tasks.create(task, [], this.comment).then(() => {
                    this.$scope.$hide();
                });
            });
        }
        return this.tasks.create(task, [], this.comment).then(() => {
            this.$scope.$hide();
        });
    }
}

export default angular.module('mpdx.tasks.newsletter.controller', [
    tasks
]).controller('newsletterTaskController', NewsletterTaskController).name;
