import { get, find } from 'lodash/fp';

class DisplayController {
    dayFirst: boolean;
    displayMonth: string;
    month: string;
    months: any[];
    constructor(
        private gettext: ng.gettext.gettextFunction,
        private locale: LocaleService
    ) {
        this.dayFirst = false;
    }
    $onChanges() {
        this.months = [
            { value: 1, display: this.gettext('Jan') },
            { value: 2, display: this.gettext('Feb') },
            { value: 3, display: this.gettext('Mar') },
            { value: 4, display: this.gettext('Apr') },
            { value: 5, display: this.gettext('May') },
            { value: 6, display: this.gettext('Jun') },
            { value: 7, display: this.gettext('Jul') },
            { value: 8, display: this.gettext('Aug') },
            { value: 9, display: this.gettext('Sep') },
            { value: 10, display: this.gettext('Oct') },
            { value: 11, display: this.gettext('Nov') },
            { value: 12, display: this.gettext('Dec') }
        ];
        const format = this.locale.dateTimeFormat;
        if (!format || !this.month) return;
        const monthIndex = format.indexOf('M');
        const dayIndex = format.indexOf('d');
        this.dayFirst = dayIndex < monthIndex;
        const month = find({ value: this.month }, this.months);
        this.displayMonth = get('display', month);
    }
}

const Display = {
    template: require('./diplay.html'),
    controller: DisplayController,
    bindings: {
        month: '<',
        day: '<'
    }
};

import 'angular-gettext';
import locale, { LocaleService } from '../locale/locale.service';

export default angular.module('mpdx.common.twoPartDateDisplay.component', [
    'gettext',
    locale
]).component('twoPartDateDisplay', Display).name;