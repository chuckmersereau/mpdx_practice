import service from './locale.service';
import moment from 'moment';

describe('contacts.service', () => {
    let locale;
    beforeEach(() => {
        angular.mock.module(service);
        inject((_locale_) => {
            locale = _locale_;
        });
    });
    describe('constructor', () => {
        it('should set default values', () => {
            expect(locale.dateTimeFormat).toEqual(null);
            expect(locale.formats).toBeDefined();
        });
    });
    describe('change', () => {
        it('should change dateTimeFormat', () => {
            locale.change('en-gb');
            expect(locale.dateTimeFormat).toEqual(locale.formats['en-gb']);
        });
        it('should default to MM/dd/yyyy for undefined', () => {
            locale.change('asdfasdfafd');
            expect(locale.dateTimeFormat).toEqual('MM/dd/yyyy');
        });
        it('should change the moment locale', () => {
            spyOn(moment, 'locale').and.callFake(() => {});
            spyOn(locale, 'handleMomentMisnomers').and.callFake(data => data);
            locale.change('en-gb');
            expect(moment.locale).toHaveBeenCalledWith(jasmine.any(String));
            expect(locale.handleMomentMisnomers).toHaveBeenCalledWith(jasmine.any(String));
        });
    });
    describe('handleMomentMisnomers', () => {
        it('should default to passed string', () => {
            expect(locale.handleMomentMisnomers('en')).toEqual('en');
        });
        it('should handle fil', () => {
            expect(locale.handleMomentMisnomers('fil')).toEqual('tl-ph');
        });
        it('should handle ga', () => {
            expect(locale.handleMomentMisnomers('ga')).toEqual('gl');
        });
        it('should handle zh', () => {
            expect(locale.handleMomentMisnomers('zh')).toEqual('zh-cn');
        });
        it('should handle zh-hant', () => {
            expect(locale.handleMomentMisnomers('zh-hant')).toEqual('zh-cn');
        });
    });
});