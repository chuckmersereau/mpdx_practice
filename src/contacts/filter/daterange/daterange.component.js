class FilterDaterangeController {
    constructor(gettextCatalog, $element) {
        this.gettextCatalog = gettextCatalog;

        this.input = $element.find('input');

        this.parseCustomOptions();

        this.options = {
            autoUpdateInput: false,
            showDropdowns: true,
            alwaysShowCalendars: true,
            drops: 'up',
            ranges: this.ranges,
            locale: this.locale
        };
        this.input.daterangepicker(this.options);
        this.input.on('apply.daterangepicker', this.apply);
        this.input.on('cancel.daterangepicker', this.cancel);
    }
    parseCustomOptions() {
        this.ranges = {};
        angular.forEach(this.customOptions, function(value, _key) {
            this.ranges[value.name] = [moment(value.start), moment(value.end)];
        });
    }
    apply(event, daterangepicker) {
        var scope = angular.element(daterangepicker.element[0]).scope();
        var newValue = daterangepicker.startDate.format('MM/DD/YYYY') + ' - ' + daterangepicker.endDate.format('MM/DD/YYYY');
        scope.this.model = newValue;
        scope.$apply();
    }
    cancel(event, daterangepicker) {
        var scope = angular.element(daterangepicker.element[0]).scope();
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
        customOptions: '<'
    }
};

export default angular.module('mpdx.contacts.filter.daterange', [])
    .component('contactsFilterDaterange', Daterange).name;
