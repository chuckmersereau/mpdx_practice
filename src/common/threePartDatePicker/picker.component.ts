import 'angular-gettext';
import locale, { LocaleService } from '../locale/locale.service';

class PickerController {
    dayFirst: boolean;
    months: any[];
    yearFirst: boolean;
    constructor(
        private gettext: ng.gettext.gettextFunction,
        private locale: LocaleService
    ) {
        this.dayFirst = false;
        this.yearFirst = false;
    }
    $onChanges() {
        this.months = [
            { value: 1, display: this.gettext('January') },
            { value: 2, display: this.gettext('February') },
            { value: 3, display: this.gettext('March') },
            { value: 4, display: this.gettext('April') },
            { value: 5, display: this.gettext('May') },
            { value: 6, display: this.gettext('June') },
            { value: 7, display: this.gettext('July') },
            { value: 8, display: this.gettext('August') },
            { value: 9, display: this.gettext('September') },
            { value: 10, display: this.gettext('October') },
            { value: 11, display: this.gettext('November') },
            { value: 12, display: this.gettext('December') }
        ];
        const format = this.locale.dateTimeFormat;
        const yearIndex = format.indexOf('y');
        const monthIndex = format.indexOf('M');
        const dayIndex = format.indexOf('d');
        this.yearFirst = yearIndex < monthIndex;
        this.dayFirst = dayIndex < monthIndex;
    }
}

const Picker = {
    template: require('./picker.html'),
    controller: PickerController,
    bindings: {
        year: '=',
        month: '=',
        day: '='
    }
};

export default angular.module('mpdx.common.threePartDatePicker.component', [
    'gettext',
    locale
]).component('threePartDatePicker', Picker).name;