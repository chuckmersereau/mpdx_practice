class DatetimepickerController {
    constructor(
        $scope,
        locale
    ) {
        this.$scope = $scope;
        this.locale = locale;
        this.isOpen = false;
    }
    $onInit() {
        if (!this.hourStep) {
            this.hourStep = 1;
        }
        if (!this.minuteStep) {
            this.minuteStep = 5;
        }
        this.ngModel.$render = () => {
            this.model = moment(this.ngModel.$viewValue);
            this.date = this.model.toDate();
            this.time = this.model.toDate();
        };
        this.$scope.$watch(() => this.date, () => {
            this.model = moment(this.date).hour(this.model.hour()).minute(this.model.minute());
            this.ngModel.$setViewValue(this.model);
        });
        this.$scope.$watch(() => this.time, () => {
            const time = moment(this.time);
            this.model = this.model.hour(time.hour()).minute(time.minute());
            this.ngModel.$setViewValue(this.model);
        });
    }
    openCalendar(e) {
        e.preventDefault();
        e.stopPropagation();
        this.isOpen = true;
    }
}

const Datetimepicker = {
    template: require('./datetimepicker.html'),
    controller: DatetimepickerController,
    require: {
        ngModel: '^ngModel',
        form: '^form'
    },
    bindings: {
        hourStep: '<',
        minuteStep: '<'
    }
};
export default angular.module('mpdx.common.datetimepicker.component', [])
    .component('datetimepicker', Datetimepicker).name;