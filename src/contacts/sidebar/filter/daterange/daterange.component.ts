import { defaultTo, reduce } from 'lodash/fp';
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
        private $element: ICustomElement,
        private gettextCatalog: ng.gettext.gettextCatalog
    ) {}
    $onInit() {
        let input = this.$element.find('input');

        const defaultRanges = {
            [this.gettextCatalog.getPlural(7, 'Last Day', 'Last {{$count}} Days', {})]: [moment().subtract(6, 'days'), moment()],
            [this.gettextCatalog.getPlural(30, 'Last 1 Day', 'Last {{$count}} Days', {})]: [moment().subtract(29, 'days'), moment()],
            [this.gettextCatalog.getString('This Month')]: [moment().startOf('month'), moment().endOf('month')],
            [this.gettextCatalog.getString('Last Month')]: [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            [this.gettextCatalog.getString('This Year')]: [moment().startOf('year'), moment().endOf('year')],
            [this.gettextCatalog.getString('Last 13 Months')]: [moment().startOf('month').subtract(13, 'months'), moment()]
        };

        this.options = {
            autoUpdateInput: false,
            showDropdowns: true,
            alwaysShowCalendars: true,
            drops: 'up',
            ranges: defaultTo(defaultRanges, this.ranges),
            locale: this.locale
        };
        input.daterangepicker(this.options);
        input.on('apply.daterangepicker', this.apply);
        input.on('cancel.daterangepicker', this.cancel);

        this.parseCustomOptions();
    }
    parseCustomOptions() {
        this.ranges = reduce((result, value) => {
            result[value.name] = [moment(value.start), moment(value.end)];
            return result;
        }, {}, this.customOptions);
    }
    apply(event, daterangepicker) {
        const scope: any = angular.element(daterangepicker.element[0]).scope();
        scope.$ctrl.model = daterangepicker.startDate.format('YYYY-MM-DD') + '..' + daterangepicker.endDate.format('YYYY-MM-DD');
        scope.$apply();
        scope.$ctrl.onChange();
    }
    cancel(event, daterangepicker) {
        const scope: any = angular.element(daterangepicker.element[0]).scope();
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

import 'angular-gettext';

export default angular.module('mpdx.contacts.filter.daterange', [
    'gettext'
]).component('contactsFilterDaterange', Daterange).name;
