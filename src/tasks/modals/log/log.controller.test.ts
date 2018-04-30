import log from './log.controller';
import { assign, each } from 'lodash/fp';
import * as moment from 'moment';

let contactList = [];
const day = moment().toDate();
const defaultTask = {
    completed: true,
    completed_at: moment(day).toISOString()
};

describe('tasks.modals.log.controller', () => {
    let $ctrl, controller, contacts, tasks, scope, rootScope, q;
    beforeEach(() => {
        jasmine.clock().install();
        jasmine.clock().mockDate(day);
        angular.mock.module(log);
        inject(($controller, $rootScope, _contacts_, _tasks_, $q) => {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            contacts = _contacts_;
            tasks = _tasks_;
            q = $q;
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
            spyOn(tasks, 'create').and.callFake(() => q.resolve({}));
            spyOn(tasks, 'addModal').and.callFake(() => q.resolve({}));
            spyOn(contacts, 'bulkSave').and.callFake(() => q.resolve({}));
            scope.$hide = () => {};
            spyOn(scope, '$hide');
            spyOn(rootScope, '$emit').and.callFake(() => {});
            $ctrl.contactsList = [{ id: '7e4a26d6-64fc-42e7-a55e-95c7995e500d' }];
            $ctrl.task = {
                subject: 'a',
                activity_type: 'Call',
                next_action: 'Call'
            };
        });
        it('should create a task', () => {
            $ctrl.save();
            expect(tasks.create).toHaveBeenCalledWith($ctrl.task, [$ctrl.contactsList[0].id], $ctrl.comment);
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
            scope.$digest();
        });
        it('should open next automation task if defined', (done) => {
            $ctrl.comment = 'ghi';
            $ctrl.save().then(() => {
                expect(tasks.addModal).toHaveBeenCalledWith({
                    contactsList: [$ctrl.contactsList[0].id],
                    activityType: $ctrl.task.next_action,
                    task: $ctrl.task,
                    comments: [$ctrl.comment]
                });
                done();
            });
            scope.$digest();
        });
        it('should set next automation task subject if same type', (done) => {
            $ctrl.comment = 'ghi';
            $ctrl.save().then(() => {
                expect(tasks.addModal).toHaveBeenCalledWith({
                    contactsList: jasmine.any(Array),
                    activityType: jasmine.any(String),
                    task: $ctrl.task,
                    comments: jasmine.any(Array)
                });
                done();
            });
            scope.$digest();
        });
        it('shouldn\'t set next automation task subject if not same type', (done) => {
            $ctrl.task.next_action = 'Answer';
            $ctrl.comment = 'ghi';
            const task = assign($ctrl.task, { next_action: 'Answer', subject: null });
            $ctrl.save().then(() => {
                expect(tasks.addModal).toHaveBeenCalledWith({
                    contactsList: jasmine.any(Array),
                    activityType: jasmine.any(String),
                    task: task,
                    comments: jasmine.any(Array)
                });
                done();
            });
            scope.$digest();
        });
        it('should emit when finished', (done) => {
            $ctrl.task.next_action = undefined;
            $ctrl.save().then(() => {
                expect(rootScope.$emit).toHaveBeenCalledWith('taskLogged');
                done();
            });
            scope.$digest();
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
    describe('activityChanged', () => {
        it('should get the 1st value for an activity type', () => {
            $ctrl.task.activity_type = 'Call';
            $ctrl.serverConstants.data.results = {
                call: ['Complete']
            };
            $ctrl.activityChanged();
            expect($ctrl.task.result).toEqual('Complete');
        });
    });
});