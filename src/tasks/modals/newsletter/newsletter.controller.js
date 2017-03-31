class NewsletterTaskController {
    constructor(
        $scope,
        tasksTags, serverConstants, tasks, contacts, users
    ) {
        this.$scope = $scope;
        this.contacts = contacts;
        this.tasksTags = tasksTags;
        this.serverConstants = serverConstants;
        this.tasks = tasks;
        this.users = users;

        this.task = {};
    }
    save() {
        let task = angular.copy(this.task);
        task.completed = true;
        if (task.activity_type === 'Newsletter - Both') {
            task.activity_type = 'Newsletter - Physical';
            return this.tasks.create(task).then(() => {
                task.activity_type = 'Newsletter - Email';
                return this.tasks.create(task).then(() => {
                    this.$scope.$hide();
                });
            });
        }
        return this.tasks.create(task).then(() => {
            this.$scope.$hide();
        });
    }
}
export default angular.module('mpdx.tasks.newsletter.controller', [])
    .controller('newsletterTaskController', NewsletterTaskController).name;
