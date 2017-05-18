import component from './datetimepicker.component';
import moment from 'moment';

const defaultModel = moment().toISOString();
describe('common.datetimepicker.component', () => {
    let $ctrl, rootScope, scope, componentController;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope) => {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            componentController = $componentController;
            loadController({ngModel: defaultModel});
        });
    });
    function loadController(bindings) {
        $ctrl = componentController('datetimepicker', {$scope: scope}, bindings);
    }
    describe('init', () => {
        it('should default the hourStep binding', () => {
            $ctrl.init();
            expect($ctrl.hourStep).toEqual(1);
        });
        it('should default the minuteStep binding', () => {
            $ctrl.init();
            expect($ctrl.minuteStep).toEqual(5);
        });
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
            expect($ctrl.time).toEqual(moment($ctrl.model).toDate());
        });
    });
    describe('$onInit', () => {
        beforeEach(() => {
            spyOn($ctrl, 'init').and.callFake(() => {});
        });
        it('should call init', () => {
            $ctrl.$onInit();
            expect($ctrl.init).toHaveBeenCalled();
        });
    });
    describe('events', () => {
        beforeEach(() => {
            loadController({ngModel: defaultModel});
            $ctrl.$onInit();
        });
        it('should change the time', () => {
            $ctrl.time = moment(defaultModel).add(1, 'hour');
            scope.$digest();
            expect($ctrl.ngModel).toEqual(moment(defaultModel).add(1, 'hour').toISOString());
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
        it(`shouldn't set model`, () => {
            expect($ctrl.model).toBeUndefined();
        });
    });
});