import component from './datetimepicker.component';
import moment from 'moment';

const defaultModel = moment().toISOString();
describe('common.datetimepicker.component', () => {
    let $ctrl, rootScope, scope, componentController;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            componentController = $componentController;
            loadController({ ngModel: defaultModel });
        });
    });

    function loadController(bindings) {
        $ctrl = componentController('datetimepicker', { $scope: scope }, bindings);
    }
    describe('init', () => {
        it('should set the model to moment of the ngModel param', () => {
            $ctrl.init();
            expect($ctrl.model).toEqual(moment(defaultModel));
        });
        it('should set date to the ngModel', () => {
            $ctrl.init();
            expect($ctrl.date).toEqual(moment($ctrl.model).toDate());
        });
        it('should set time to the ngModel', () => {
            $ctrl.init();
            expect($ctrl.time).toEqual(moment($ctrl.model).format('LT'));
        });
    });
    describe('$onInit', () => {
        beforeEach(() => {
            spyOn($ctrl, 'init').and.callFake(() => {});
        });
        afterEach(() => {
            $ctrl.$onDestroy();
        });
        it('should call init', () => {
            $ctrl.$onInit();
            expect($ctrl.init).toHaveBeenCalled();
        });
        it('should default the hourStep binding', () => {
            $ctrl.$onInit();
            expect($ctrl.hourStep).toEqual(1);
        });
        it('should default the minuteStep binding', () => {
            $ctrl.$onInit();
            expect($ctrl.minuteStep).toEqual(15);
        });
        it('should build times array', () => {
            $ctrl.minuteStep = 60;
            $ctrl.$onInit();
            expect($ctrl.times).toEqual(['12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM', '6:00 AM',
                '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
                '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM']);
        });
    });
    describe('$onChanges', () => {
        beforeEach(() => {
            spyOn($ctrl, 'init').and.callFake(() => {});
        });
        it('should call init', () => {
            $ctrl.$onChanges();
            expect($ctrl.init).toHaveBeenCalled();
        });
    });
    describe('$onDestroy', () => {
        beforeEach(() => {
            $ctrl.$onInit();
            spyOn($ctrl, 'dateWatcher').and.callFake(() => {});
            spyOn($ctrl, 'timeWatcher').and.callFake(() => {});
        });
        it('should cancel the watchers', () => {
            $ctrl.$onDestroy();
            expect($ctrl.dateWatcher).toHaveBeenCalledWith();
            expect($ctrl.timeWatcher).toHaveBeenCalledWith();
        });
    });
    describe('events', () => {
        beforeEach(() => {
            loadController({ ngModel: defaultModel });
            $ctrl.model = moment(defaultModel);
            $ctrl.$onInit();
        });
        it('should change the time', () => {
            $ctrl.time = moment(defaultModel).add(1, 'hour').format('LT');
            scope.$digest();
            const parseTime = moment(`${moment(defaultModel).format('YYYY-MM-DD')} ${$ctrl.time}`, 'YYYY-MM-DD LT');
            expect(moment($ctrl.ngModel).hour()).toEqual(parseTime.hour());
        });
        it('should change the date', () => {
            $ctrl.date = moment(defaultModel).add(1, 'day');
            scope.$digest();
            expect($ctrl.ngModel).toEqual(moment(defaultModel).add(1, 'day').toISOString());
        });
    });
    describe('init - null model', () => {
        beforeEach(() => {
            loadController({});
        });
        it('shouldn\'t set model', () => {
            expect($ctrl.model).toBeUndefined();
        });
    });
    describe('focus', () => {
        it('should init on focus', () => {
            spyOn($ctrl, 'init').and.callFake(() => {});
            $ctrl.focus();
            expect($ctrl.ngModel).toBeDefined();
            expect($ctrl.init).toHaveBeenCalled();
        });
    });
    describe('selectTime', () => {
        it('should set the time', () => {
            $ctrl.selectTime('a');
            expect($ctrl.time).toEqual('a');
        });
    });
});
