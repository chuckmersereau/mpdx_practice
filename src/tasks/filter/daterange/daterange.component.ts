import { reduce } from 'lodash/fp';
import * as moment from 'moment';

interface ICustomElement extends ng.IRootElementService{
    daterangepicker: any;
}

class FilterDaterangeController {
    customOptions: any;
    locale: any;
    options: any;
    ranges: any;
    constructor(
        private $element: ICustomElement
    ) {
        let input = $element.find('input');

        this.parseCustomOptions();

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
    parseCustomOptions() {
        this.ranges = reduce((result, value) => {
            result[value.name] = [moment(value.start), moment(value.end)];
            return result;
        }, {}, this.customOptions);
    }
    apply(event, daterangepicker) {
        let scope: any = angular.element(daterangepicker.element[0]).scope();
        const newValue = daterangepicker.startDate.format('MM/DD/YYYY') + ' - ' + daterangepicker.endDate.format('MM/DD/YYYY');
        scope.$ctrl.model = newValue;
        scope.$apply();
    }
    cancel(event, daterangepicker) {
        let scope: any = angular.element(daterangepicker.element[0]).scope();
        scope.$ctrl.model = '';
        scope.$apply();
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

export default angular.module('mpdx.tasks.filter.daterange', [])
    .component('tasksFilterDaterange', Daterange).name;
