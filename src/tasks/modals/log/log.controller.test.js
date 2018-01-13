import log from './log.controller';
import assign from 'lodash/fp/assign';
import each from 'lodash/fp/each';
import moment from 'moment';

let contactList = [];
const day = moment().toDate();
const defaultTask = {
    completed: true,
    completed_at: moment(day).toISOString()
};

describe('tasks.modals.log.controller', () => {
    let $ctrl, controller, contacts, tasks, scope, rootScope;
    beforeEach(() => {
        jasmine.clock().install();
        jasmine.clock().mockDate(day);
        angular.mock.module(log);
        inject(($controller, $rootScope, _contacts_, _tasks_) => {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            contacts = _contacts_;
            tasks = _tasks_;
            controller = $controller;
            $ctrl = loadController();
        });
    });
    afterEach(() => {
        jasmine.clock().uninstall();
    });

    function loadController() {
        return controller('logTaskController as $ctrl', {
            $scope: scope,
            contactsList: contactList
        });
    }

    function defaultPartnerStatus() {
        $ctrl.task = assign(defaultTask, {
            activity_type: 'Active'
        });
        $ctrl.contactsList = [{ id: 1 }];
    }
    describe('constructor', () => {
        it('should set the new task model to complete', () => {
            expect($ctrl.task).toEqual(defaultTask);
        });
    });
    describe('save', () => {
        beforeEach(() => {
            spyOn(tasks, 'create').and.callFake(() => Promise.resolve({}));
            spyOn(tasks, 'addModal').and.callFake(() => Promise.resolve({}));
            spyOn(contacts, 'bulkSave').and.callFake(() => Promise.resolve({}));
            scope.$hide = () => {};
            spyOn(scope, '$hide');
            spyOn(rootScope, '$emit').and.callFake(() => {});
        });
        it('should create a task', () => {
            $ctrl.save();
            expect(tasks.create).toHaveBeenCalledWith($ctrl.task, $ctrl.contactsList, $ctrl.comment);
        });
        it('should update contacts if conditions are met', () => {
            $ctrl.status = 'Active';
            defaultPartnerStatus();
            $ctrl.save();
            expect(contacts.bulkSave).toHaveBeenCalledWith([{ id: 1, status: $ctrl.status }]);
        });
        it('should hide the modal when finished', (done) => {
            $ctrl.save().then(() => {
                expect(scope.$hide).toHaveBeenCalled();
                done();
            });
        });
        it('should open next automation task if defined', (done) => {
            $ctrl.task.next_action = 'Call';
            $ctrl.comment = 'ghi';
            $ctrl.save().then(() => {
                expect(tasks.addModal).toHaveBeenCalledWith({
                    contactsList: $ctrl.contactsList,
                    activityType: $ctrl.task.next_action,
                    task: $ctrl.task,
                    comments: [$ctrl.comment]
                });
                done();
            });
        });
        it('should emit when finished', (done) => {
            $ctrl.save().then(() => {
                expect(rootScope.$emit).toHaveBeenCalledWith('taskLogged');
                done();
            });
        });
    });
    describe('showPartnerStatus', () => {
        beforeEach(() => {
            // default to true conditions
            defaultPartnerStatus();
        });
        it('should be true when conditions are met', () => {
            expect($ctrl.showPartnerStatus()).toBeTruthy();
        });
        it('should be false with empty contactList', () => {
            $ctrl.contactsList = [];
            expect($ctrl.showPartnerStatus()).toBeFalsy();
        });
        it('should be false without a task activity_type', () => {
            $ctrl.task = defaultTask;
            expect($ctrl.showPartnerStatus()).toBeFalsy();
        });
        it('should be false when certain activity_types are set', () => {
            const arr = ['Pre Call Letter', 'Reminder Letter', 'Support Letter', 'Thank', 'To Do'];
            each((activity) => {
                $ctrl.task.activity_type = activity;
                expect($ctrl.showPartnerStatus()).toBeFalsy();
            }, arr);
        });
    });
});