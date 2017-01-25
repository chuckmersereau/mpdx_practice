class FilterDaterangeController {
    constructor($element) {
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
        this.ranges = {};
        _.each(this.customOptions, (value) => {
            this.ranges[value.name] = [moment(value.start), moment(value.end)];
        });
    }
    apply(event, daterangepicker) {
        let scope = angular.element(daterangepicker.element[0]).scope();
        scope.this.model = daterangepicker.startDate.format('MM/DD/YYYY') + ' - ' + daterangepicker.endDate.format('MM/DD/YYYY');
        scope.$apply();
    }
    cancel(event, daterangepicker) {
        let scope = angular.element(daterangepicker.element[0]).scope();
        scope.this.model = '';
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

export default angular.module('mpdx.contacts.filter.daterange', [])
    .component('contactsFilterDaterange', Daterange).name;
