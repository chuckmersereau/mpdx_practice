import moment from 'moment';
import defaultTo from 'lodash/fp/defaultTo';
import isNil from 'lodash/fp/isNil';

class DatetimepickerController {
    locale;
    constructor(
        $scope,
        locale
    ) {
        this.$scope = $scope;
        this.locale = locale;
    }

    $onInit() {
        this.init();
        this.$scope.$watch('$ctrl.date', () => {
            if (this.date) {
                this.model = this.model ? moment(this.date).hour(this.model.hour()).minute(this.model.minute()) : moment(this.date);
                this.ngModel = this.model.toISOString();
            }
        });
        this.$scope.$watch('$ctrl.time', () => {
            if (!isNil(this.time)) {
                this.model = defaultTo(moment(), this.model);
                const time = moment(this.time);
                this.model = this.model.hour(time.hour()).minute(time.minute());
                this.ngModel = this.model.toISOString();
            }
        });
    }
    $onChanges() {
        this.init();
    }
    init() {
        if (!this.hourStep) {
            this.hourStep = 1;
        }
        if (!this.minuteStep) {
            this.minuteStep = 5;
        }

        if (this.ngModel) {
            this.model = moment(this.ngModel);
            this.date = this.model.toDate();
            this.time = this.model.toDate();
        }
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