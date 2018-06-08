import * as moment from 'moment';
import filters from './locale.filter';

const date = Date.parse('2000-02-01T14:48:00');

describe('The test filter', () => {
    let $filter, locale;
    beforeEach(() => {
        angular.mock.module(filters);
        inject((_$filter_, _locale_) => {
            $filter = _$filter_;
            locale = _locale_;
            locale.dateTimeFormat = 'MM/dd/yyyy';
        });
    });

    it('output a formatted date', () => {
        expect($filter('localize')(date)).toEqual($filter('date')(date, locale.dateTimeFormat));
    });

    it('output a formatted date', () => {
        expect($filter('localizeWithTime')(date)).toEqual($filter('date')(date, locale.dateTimeFormat + ' hh:mm a'));
    });

    it('output a formatted date', () => {
        expect($filter('localizeShort')(date)).toEqual(moment(date).format('MMM D'));
    });

    it('output a formatted date', () => {
        expect($filter('localizeShortWYear')(date)).toEqual(moment(date).format('MMM D YYYY'));
    });
});