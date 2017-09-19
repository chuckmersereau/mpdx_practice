import moment from 'moment';
import filters from './moment.filter';

const date = Date.parse('2000-02-01T14:48:00');

describe('common.moment.filter', () => {
    let $filter;
    beforeEach(() => {
        angular.mock.module(filters);
        inject((_$filter_) => {
            $filter = _$filter_;
        });
    });
    it('output a formatted date', () => {
        expect($filter('moment')(date, 'YYYY-MM-DD')).toEqual(moment(date).format('YYYY-MM-DD'));
    });
});