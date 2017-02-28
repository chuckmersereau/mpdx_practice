import config from 'config';

class Language {
    constructor(
        gettextCatalog
    ) {
        this.gettextCatalog = gettextCatalog;
        this.dateTimeFormat = null;
    }
    change(language) {
        let temp = angular.copy(language);
        //hardcoded until the data is fixed
        if (language === 'fr-fr') {
            language = 'fr_FR';
            temp = 'fr-FR';
        } else if (language === 'es-419') {
            language = 'es_419';
        } else if (language === 'zh-hans-cn') {
            language = "zh_Hans_CN";
            temp = 'zh-Hans-CN';
        } else if (language === 'en-us') {
            language = 'en_us';
        }
        this.gettextCatalog.setCurrentLanguage(language);

        if (config.env !== 'development' && language !== 'en-us') {
            this.gettextCatalog.loadRemote(`locale/${temp}-${process.env.TRAVIS_COMMIT}.json`);
        }
    }
}

export default angular.module('mpdx.common.language.service', [])
    .service('language', Language).name;