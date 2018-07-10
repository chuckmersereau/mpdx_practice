import * as moment from 'moment';
import component from './datetimepicker.component';

const defaultModel = moment().toISOString();
const defaultEvent = {
    preventDefault: () => {}
};

describe('common.datetimepicker.component', () => {
    let $ctrl, rootScope, scope, componentController;

    function loadController(bindings) {
        $ctrl = componentController('datetimepicker', { $scope: scope }, bindings);
    }

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            componentController = $componentController;
            loadController({ ngModel: defaultModel });
        });
    });

    describe('constructor', () => {
        it('should check to see if the browser is safari', () => {
            expect($ctrl.isSafari).toBeFalsy();
        });
    });

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

        it('should hide the time dropdown', () => {
            $ctrl.init();
            expect($ctrl.showDropdown).toBeFalsy();
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

        it('should handle null date', () => {
            $ctrl.ngModel = '2018-02-28T15:25:47Z';
            $ctrl.$onInit();
            $ctrl.date = null;
            scope.$digest();
            expect($ctrl.ngModel).toBeUndefined();
            expect($ctrl.time).toEqual(null);
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

    describe('onFocus', () => {
        it('should init on focus', () => {
            spyOn($ctrl, 'init').and.callFake(() => {});
            $ctrl.onFocus();
            expect($ctrl.ngModel).toBeDefined();
            expect($ctrl.init).toHaveBeenCalled();
        });
    });

    describe('onSelectTime', () => {
        beforeEach(() => {
            spyOn($ctrl, 'focusElementById').and.callFake(() => {});
            spyOn($ctrl, 'focusTimeInputElement').and.callFake(() => {});
        });

        it('should set the time', () => {
            $ctrl.onSelectTime('a');
            $ctrl.$timeout.flush();
            expect($ctrl.time).toEqual('a');
        });

        it('should focus time input', () => {
            $ctrl.onSelectTime('a');
            $ctrl.$timeout.flush();
            expect($ctrl.focusTimeInputElement).toHaveBeenCalledWith();
        });
    });

    describe('onTimeFocus', () => {
        const event = { relatedTarget: { id: 'time_123_0' } };
        beforeEach(() => {
            spyOn($ctrl, 'onFocus').and.callFake(() => {});
            $ctrl.showDropdown = false;
        });

        it('should call focus', () => {
            $ctrl.onTimeFocus(event);
            expect($ctrl.onFocus).toHaveBeenCalledWith();
        });

        it('shouldn\'t show dropdown on menu item', () => {
            $ctrl.onTimeFocus(event);
            expect($ctrl.showDropdown).toBeFalsy();
        });

        it('should show dropdown', () => {
            const ddEvent = { relatedTarget: {} };
            $ctrl.onTimeFocus(ddEvent);
            expect($ctrl.showDropdown).toBeTruthy();
        });
    });

    describe('onTimeBlur', () => {
        beforeEach(() => {
            spyOn($ctrl, 'onFocus').and.callFake(() => {});
            $ctrl.showDropdown = true;
        });

        it('shouldn\'t show dropdown on menu item', () => {
            const event = { relatedTarget: { id: 'time_123_0' } };
            $ctrl.onTimeBlur(event);
            expect($ctrl.showDropdown).toBeTruthy();
        });

        it('should show dropdown', () => {
            const ddEvent = { relatedTarget: {} };
            $ctrl.onTimeBlur(ddEvent);
            $ctrl.$timeout.flush();
            expect($ctrl.showDropdown).toBeFalsy();
        });

        it('should wait 250ms on safari', () => {
            spyOn($ctrl, '$timeout').and.returnValue('');
            const event = { relatedTarget: { id: 'time_123_0' } };
            $ctrl.isSafari = true;
            $ctrl.onTimeBlur(event);
            expect($ctrl.$timeout).toHaveBeenCalledWith(jasmine.any(Function), 250);
        });

        it('shouldn\'t wait on other browsers', () => {
            spyOn($ctrl, '$timeout').and.returnValue('');
            const event = { relatedTarget: { id: 'time_123_0' } };
            $ctrl.isSafari = false;
            $ctrl.onTimeBlur(event);
            expect($ctrl.$timeout).toHaveBeenCalledWith(jasmine.any(Function), 0);
        });
    });

    describe('onTimeKeydown', () => {
        let event;
        beforeEach(() => {
            event = defaultEvent;
            spyOn($ctrl, 'focusElementById').and.callFake(() => {});
            spyOn(event, 'preventDefault').and.callFake(() => {});
            $ctrl.showDropdown = false;
        });

        it('should show dropdown on down arrow', () => {
            event.key = 'ArrowDown';
            $ctrl.onTimeKeydown(event);
            expect($ctrl.showDropdown).toBeTruthy();
        });

        it('should prevent default', () => {
            event.key = 'ArrowDown';
            $ctrl.onTimeKeydown(event);
            expect(event.preventDefault).toHaveBeenCalledWith();
        });
    });

    describe('onMenuItemKeydown', () => {
        let event;
        beforeEach(() => {
            spyOn($ctrl, 'focusElementById').and.callFake(() => {});
            spyOn($ctrl, 'onSelectTime').and.callFake(() => {});
            spyOn($ctrl, 'focusTimeInputElement').and.callFake(() => {});
            $ctrl.times = ['a', 'b'];
            event = defaultEvent;
            $ctrl.showDropdown = true;
        });

        it('should focus next element', () => {
            event.key = 'ArrowDown';
            $ctrl.onMenuItemKeydown(event, 0);
            expect($ctrl.focusElementById).toHaveBeenCalledWith(`a#time_${$ctrl.$scope.$id}_1`);
        });

        it('should focus time input', () => {
            event.key = 'ArrowDown';
            $ctrl.onMenuItemKeydown(event, 1);
            expect($ctrl.focusTimeInputElement).toHaveBeenCalledWith();
        });

        it('should focus previous element', () => {
            event.key = 'ArrowUp';
            $ctrl.onMenuItemKeydown(event, 1);
            expect($ctrl.focusElementById).toHaveBeenCalledWith(`a#time_${$ctrl.$scope.$id}_0`);
        });

        it('should focus time input', () => {
            event.key = 'ArrowUp';
            $ctrl.onMenuItemKeydown(event, 0);
            expect($ctrl.focusTimeInputElement).toHaveBeenCalledWith();
        });

        it('should select time on space', () => {
            event.key = ' ';
            $ctrl.onMenuItemKeydown(event, 0);
            expect($ctrl.onSelectTime).toHaveBeenCalledWith();
        });

        it('should focus last element', () => {
            event.key = 'End';
            $ctrl.onMenuItemKeydown(event, 0);
            expect($ctrl.focusElementById).toHaveBeenCalledWith(`a#time_${$ctrl.$scope.$id}_1`);
        });

        it('should focus first element', () => {
            event.key = 'Home';
            $ctrl.onMenuItemKeydown(event, 0);
            expect($ctrl.focusElementById).toHaveBeenCalledWith(`a#time_${$ctrl.$scope.$id}_0`);
        });

        it('should hide dropdown', () => {
            event.key = 'Tab';
            $ctrl.onMenuItemKeydown(event, 1);
            expect($ctrl.showDropdown).toBeFalsy();
        });

        it('should focus input', () => {
            event.key = 'Tab';
            $ctrl.onMenuItemKeydown(event, 1);
            expect($ctrl.focusTimeInputElement).toHaveBeenCalledWith();
        });
    });

    describe('focusTimeInputElement', () => {
        beforeEach(() => {
            spyOn($ctrl, 'focusElementById').and.callFake(() => {});
        });

        it('should focus the time input', () => {
            $ctrl.focusTimeInputElement();
            expect($ctrl.focusElementById).toHaveBeenCalledWith(`input#tp_${$ctrl.$scope.$id}`);
        });

        it('should hide dropdown', () => {
            $ctrl.focusTimeInputElement();
            expect($ctrl.showDropdown).toBeFalsy();
        });
    });

    describe('onFocusTime', () => {
        it('should set focusedTime', () => {
            const time = '123';
            $ctrl.onFocusTime(time);
            expect($ctrl.focusedTime).toEqual(time);
        });
    });

    describe('focusElementById', () => {
        let spy;
        let resp: any = ['a'];
        resp.focus = () => {};
        beforeEach(() => {
            spy = spyOn(angular, 'element').and.callFake(() => resp);
            spyOn(resp, 'focus').and.callFake(() => resp);
            spyOn(document, 'querySelector').and.callFake(() => 'element');
        });

        afterEach(() => {
            spy.and.callThrough();
        });

        it('should focus element', () => {
            $ctrl.focusElementById('input#tp');
            expect(document.querySelector).toHaveBeenCalledWith('input#tp');
            expect(angular.element).toHaveBeenCalledWith('element');
            expect(angular.element).toHaveBeenCalledWith('a');
            expect(resp.focus).toHaveBeenCalledWith();
        });
    });
});
