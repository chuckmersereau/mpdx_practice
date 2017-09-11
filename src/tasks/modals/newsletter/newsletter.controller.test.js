import newsletter from './newsletter.controller';

describe('tasks.modals.newsletter.controller', () => {
    let $ctrl, controller, scope, tasks;
    beforeEach(() => {
        angular.mock.module(newsletter);
        inject(($rootScope, $controller, _tasks_) => {
            scope = $rootScope.$new();
            tasks = _tasks_;
            controller = $controller;
            $ctrl = loadController();
        });
    });

    function loadController() {
        return controller('newsletterTaskController as $ctrl', { $scope: scope });
    }

    describe('constructor', () => {
        it('should set default values', () => {
            expect($ctrl.task).toEqual({ completed: true, activity_type: 'Newsletter - Both' });
        });
    });

    describe('save', () => {
        beforeEach(() => {
            spyOn(tasks, 'create').and.callFake(() => Promise.resolve({}));
            scope.$hide = () => {};
            spyOn(scope, '$hide');
            $ctrl.comment = 'abc';
        });

        it('should return a promise', () => {
            expect($ctrl.save()).toEqual(jasmine.any(Promise));
        });

        describe('promise successful', () => {
            describe('Newsletter - Both', () => {
                it('should create a two tasks', (done) => {
                    $ctrl.save().then(() => {
                        expect(tasks.create).toHaveBeenCalledWith({ completed: true, activity_type: 'Newsletter - Physical' }, [], 'abc');
                        expect(tasks.create).toHaveBeenCalledWith({ completed: true, activity_type: 'Newsletter - Email' }, [], 'abc');
                        done();
                    });
                });

                it('should hide the modal when finished', (done) => {
                    $ctrl.save().then(() => {
                        expect(scope.$hide).toHaveBeenCalled();
                        done();
                    });
                });
            });

            describe('Newsletter - Physical', () => {
                beforeEach(() => {
                    $ctrl.task.activity_type = 'Newsletter - Physical';
                });

                it('should create a task', (done) => {
                    $ctrl.save().then(() => {
                        expect(tasks.create).toHaveBeenCalledWith({ completed: true, activity_type: 'Newsletter - Physical' }, [], 'abc');
                        expect(tasks.create).not.toHaveBeenCalledWith({ completed: true, activity_type: 'Newsletter - Email' }, [], 'abc');
                        done();
                    });
                });

                it('should hide the modal when finished', (done) => {
                    $ctrl.save().then(() => {
                        expect(scope.$hide).toHaveBeenCalled();
                        done();
                    });
                });
            });

            describe('Newsletter - Email', () => {
                beforeEach(() => {
                    $ctrl.task.activity_type = 'Newsletter - Email';
                });

                it('should create a task', (done) => {
                    $ctrl.save().then(() => {
                        expect(tasks.create).not.toHaveBeenCalledWith({ completed: true, activity_type: 'Newsletter - Physical' }, [], 'abc');
                        expect(tasks.create).toHaveBeenCalledWith({ completed: true, activity_type: 'Newsletter - Email' }, [], 'abc');
                        done();
                    });
                });

                it('should hide the modal when finished', (done) => {
                    $ctrl.save().then(() => {
                        expect(scope.$hide).toHaveBeenCalled();
                        done();
                    });
                });
            });
        });
    });
});