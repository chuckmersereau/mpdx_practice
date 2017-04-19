import moment from 'moment';

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
            this.model = moment(this.date).hour(this.model.hour()).minute(this.model.minute());
            this.ngModel = this.model.toISOString();
        });
        this.$scope.$watch('$ctrl.time', () => {
            const time = moment(this.time);
            this.model = this.model.hour(time.hour()).minute(time.minute());
            this.ngModel = this.model.toISOString();
        });
    }
    $onChange() {
        this.init();
    }
    init() {
        if (!this.hourStep) {
            this.hourStep = 1;
        }
        if (!this.minuteStep) {
            this.minuteStep = 5;
        }

        this.model = moment(this.ngModel);
        this.date = this.model.toDate();
        this.time = this.model.toDate();
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
export default angular.module('mpdx.common.datetimepicker.component', [])
    .component('datetimepicker', Datetimepicker).name;