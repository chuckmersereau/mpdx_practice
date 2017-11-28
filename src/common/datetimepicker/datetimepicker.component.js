import moment from 'moment';
import defaultTo from 'lodash/fp/defaultTo';
import isNil from 'lodash/fp/isNil';
import times from 'lodash/fp/times';

class DatetimepickerController {
    constructor(
        $scope,
        locale
    ) {
        this.$scope = $scope;
        this.locale = locale;
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
    }
    focus() {
        if (!this.model) {
            this.ngModel = moment().hour(12).minute(0).toISOString();
            this.init();
        }
    }
    selectTime(localTime) {
        this.time = localTime;
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

import locale from '../locale/locale.service';

export default angular.module('mpdx.common.datetimepicker.component', [
    locale
]).component('datetimepicker', Datetimepicker).name;