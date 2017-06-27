import service from './language.service';

describe('common.language', () => {
    let language, gettextCatalog;
    beforeEach(() => {
        angular.mock.module(service);
        inject((_gettextCatalog_, _language_) => {
            language = _language_;
            gettextCatalog = _gettextCatalog_;
        });
        spyOn(gettextCatalog, 'loadRemote').and.callFake(() => {});
        spyOn(gettextCatalog, 'setCurrentLanguage').and.callFake(() => {});
    });
    describe('change', () => {
        it('should change the language', () => {
            language.change('abc');
            expect(gettextCatalog.loadRemote).toHaveBeenCalledWith('locale/abc-undefined.json');
            expect(gettextCatalog.setCurrentLanguage).toHaveBeenCalledWith('abc');
        });
        it('should handle fr-fr', () => {
            language.change('fr-fr');
            expect(gettextCatalog.loadRemote).toHaveBeenCalledWith('locale/fr-FR-undefined.json');
            expect(gettextCatalog.setCurrentLanguage).toHaveBeenCalledWith('fr_FR');
        });
        it('should handle es-419', () => {
            language.change('es-419');
            expect(gettextCatalog.loadRemote).toHaveBeenCalledWith('locale/es-419-undefined.json');
            expect(gettextCatalog.setCurrentLanguage).toHaveBeenCalledWith('es_419');
        });
        it('should handle zh-hans-cn', () => {
            language.change('zh-hans-cn');
            expect(gettextCatalog.loadRemote).toHaveBeenCalledWith('locale/zh-Hans-CN-undefined.json');
            expect(gettextCatalog.setCurrentLanguage).toHaveBeenCalledWith('zh_Hans_CN');
        });
        it('should handle en-us', () => {
            language.change('en-us');
            expect(gettextCatalog.loadRemote).toHaveBeenCalledWith('locale/en-us-undefined.json');
            expect(gettextCatalog.setCurrentLanguage).toHaveBeenCalledWith('en_us');
        });
        it('should handle fr-ca', () => {
            language.change('fr-ca');
            expect(gettextCatalog.loadRemote).toHaveBeenCalledWith('locale/fr-CA-undefined.json');
            expect(gettextCatalog.setCurrentLanguage).toHaveBeenCalledWith('fr_ca');
        });
    });
});