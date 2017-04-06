class TasksController {
    help;
    constructor(
        help
    ) {
            
            
    help.suggest([
        '58d3d70ddd8c8e7f5974d3ca',
        '584acfaa9033602d65f6e191',
        '58482329c6979106d373b517',
        '584823979033600698177abb',
        '584824fdc6979106d373b528',
        '5848244c9033600698177abf',
        '58496bf1903360069817816c',
        '5848254b9033600698177ac7',
        '58496a51c6979106d373bb48',
        '58496adb9033600698178161',
        ]);
        }
}

const Tasks = {
    controller: TasksController,
    template: require('./tasks.html')
};

export default angular.module('mpdx.tasks.component', [])
    .component('tasks', Tasks).name;
