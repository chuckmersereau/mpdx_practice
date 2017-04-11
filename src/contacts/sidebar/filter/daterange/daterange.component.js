import reduce from 'lodash/fp/reduce';
import moment from 'moment';

class FilterDaterangeController {
    constructor(
        $element
    ) {
        let input = $element.find('input');

        this.options = {
            autoUpdateInput: false,
            showDropdowns: true,
            alwaysShowCalendars: true,
            drops: 'up',
            ranges: this.ranges,
            locale: this.locale
        };
        input.daterangepicker(this.options);
        input.on('apply.daterangepicker', this.apply);
        input.on('cancel.daterangepicker', this.cancel);
    }
    $onInit() {
        this.parseCustomOptions();
    }
    parseCustomOptions() {
        this.ranges = reduce((result, value) => {
            result[value.name] = [moment(value.start), moment(value.end)];
            return result;
        }, {}, this.customOptions);
    }
    apply(event, daterangepicker) {
        const scope = angular.element(daterangepicker.element[0]).scope();
        scope.$ctrl.model = daterangepicker.startDate.format('YYYY-MM-DD') + '..' + daterangepicker.endDate.format('YYYY-MM-DD');
        scope.$apply();
        scope.$ctrl.onChange();
    }
    cancel(event, daterangepicker) {
        const scope = angular.element(daterangepicker.element[0]).scope();
        scope.$ctrl.model = '';
        scope.$apply();
        scope.$ctrl.onChange();
    }
}

const Daterange = {
    controller: FilterDaterangeController,
    template: require('./daterange.html'),
    bindings: {
        model: '=',
        locale: '<',
        customOptions: '<',
        onChange: '&'
    }
};

export default angular.module('mpdx.contacts.filter.daterange', [])
    .component('contactsFilterDaterange', Daterange).name;