import * as bowser from 'bowser';
import * as moment from 'moment';
import { defaultTo, get, isNil, startsWith, times } from 'lodash/fp';
import locale, { LocaleService } from '../locale/locale.service';

class DatetimepickerController {
    date: moment.Moment;
    dateWatcher: any;
    focusedTime: string;
    hourStep: number;
    isSafari: boolean;
    minuteStep: number;
    model: any;
    ngModel: any;
    showDropdown: boolean;
    times: any;
    time: string;
    timeWatcher: any;
    constructor(
        private $scope: ng.IScope,
        private $timeout: ng.ITimeoutService,
        private locale: LocaleService
    ) {
        this.isSafari = bowser.name === 'Safari';
    }
    $onInit() {
        if (!this.hourStep) {
            this.hourStep = 1;
        }
        if (!this.minuteStep) {
            this.minuteStep = 15;
        }

        this.init();

        const date = moment().startOf('d');
        const hours = 24 / this.hourStep;
        const intervals = hours * 60 / this.minuteStep;
        this.times = times((index) => {
            return moment(date).add(index * this.minuteStep, 'minutes').format('LT');
        }, intervals);

        this.dateWatcher = this.$scope.$watch('$ctrl.date', () => {
            if (this.date) {
                this.model = this.model
                    ? moment(this.date).hour(this.model.hour()).minute(this.model.minute())
                    : moment(this.date);
                this.ngModel = this.model.toISOString();
            } else {
                this.ngModel = undefined;
                this.time = null;
            }
        });

        this.timeWatcher = this.$scope.$watch('$ctrl.time', () => {
            if (!isNil(this.time)) {
                this.model = defaultTo(moment(), this.model);
                const time = moment(`${this.model.format('YYYY-MM-DD')} ${this.time}`, 'YYYY-MM-DD LT');
                this.model = this.model.hour(time.hour()).minute(time.minute());
                this.ngModel = this.model.toISOString();
            }
        });
    }
    $onChanges() {
        this.init();
    }
    $onDestroy() {
        this.dateWatcher();
        this.timeWatcher();
    }
    init() {
        if (this.ngModel) {
            this.model = moment(this.ngModel);
            this.date = this.model.toDate();
            this.time = this.model.format('LT');
        }
        this.showDropdown = false;
    }
    onFocus() {
        if (!this.model) {
            this.ngModel = moment().hour(12).minute(0).toISOString();
            this.init();
        }
    }
    onTimeBlur(event) {
        const timeoutLength = this.isSafari ? 250 : 0;
        this.$timeout(() => { // safari kills threads on blur
            if (
                !startsWith('time_', get('id', event.relatedTarget))
                && !startsWith('tp_', get('id', event.target))
            ) {
                this.showDropdown = false;
            }
        }, timeoutLength);
    }
    onTimeFocus(event) {
        this.onFocus();
        if (!startsWith('time_', get('id', event.relatedTarget))) {
            this.showDropdown = true;
        }
    }
    onTimeKeydown(event) {
        if (event.key === 'ArrowDown') {
            this.showDropdown = true;
            this.focusElementById(`a#time_${this.$scope.$id}_0`);
            event.preventDefault();
        }
    }
    onMenuItemKeydown(event, index) {
        switch (event.key) {
            case 'ArrowDown':
                if (index < this.times.length - 1) {
                    this.focusElementById(`a#time_${this.$scope.$id}_${index + 1}`);
                } else {
                    this.focusTimeInputElement();
                }
                event.preventDefault();
                break;
            case 'ArrowUp':
                if (index > 0) {
                    this.focusElementById(`a#time_${this.$scope.$id}_${index - 1}`);
                } else {
                    this.focusTimeInputElement();
                }
                event.preventDefault();
                break;
            case ' ':
                this.onSelectTime();
                break;
            case 'End':
                this.focusElementById(`a#time_${this.$scope.$id}_${this.times.length - 1}`);
                event.preventDefault();
                break;
            case 'Home':
                this.focusElementById(`a#time_${this.$scope.$id}_0`);
                event.preventDefault();
                break;
            case 'Tab':
                this.showDropdown = false;
                this.focusTimeInputElement();
                event.preventDefault();
                break;
        }
    }
    onSelectTime(localTime = null) {
        this.time = defaultTo(this.focusedTime, localTime);
        this.$timeout(() => {
            this.focusTimeInputElement();
            this.showDropdown = false; // safari scrollbar workaround
        });
    }
    focusTimeInputElement() {
        this.showDropdown = false;
        this.focusElementById(`input#tp_${this.$scope.$id}`);
    }
    // for keyboard navigation
    onFocusTime(localTime) {
        this.focusedTime = localTime;
    }
    focusElementById(s: string) {
        const elementById = document.querySelector(s);
        const $elementsById = angular.element(elementById);
        const el = get(0, $elementsById);
        angular.element(el).focus();
    }
}

const Datetimepicker = {
    template: require('./datetimepicker.html'),
    controller: DatetimepickerController,
    require: {
        form: '^form'
    },
    bindings: {
        ngModel: '=ngModel',
        hourStep: '<',
        minuteStep: '<'
    }
};

export default angular.module('mpdx.common.datetimepicker.component', [
    locale
]).component('datetimepicker', Datetimepicker).name;