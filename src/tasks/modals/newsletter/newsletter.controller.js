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
        if (this.task.activity_type === 'Newsletter - Both') {
            this.task.activity_type = 'Newsletter - Physical';
            return this.tasks.create(this.task).then(() => {
                this.task.activity_type = 'Newsletter - Email';
                return this.tasks.create(this.task).then(() => {
                    this.$scope.$hide();
                });
            });
        }
        return this.tasks.create(this.task).then(() => {
            this.$scope.$hide();
        });
    }
}
export default angular.module('mpdx.tasks.newsletter.controller', [])
    .controller('newsletterTaskController', NewsletterTaskController).name;
