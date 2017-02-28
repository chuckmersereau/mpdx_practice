import config from 'config';

class Language {
    constructor(
        gettextCatalog
    ) {
        this.gettextCatalog = gettextCatalog;
        this.dateTimeFormat = null;
    }
    change(language) {
        const temp = angular.copy(language);
        //hardcoded until the data is fixed
        if (language === 'fr-fR') {
            language = 'fr_FR';
        } else if (language === 'es-419') {
            language = 'es_419';
        }
        this.gettextCatalog.setCurrentLanguage(language);

        if (config.env !== 'development' && language !== 'en') {
            this.gettextCatalog.loadRemote(`locale/${temp}-${process.env.TRAVIS_COMMIT}.json`);
        }
    }
}

export default angular.module('mpdx.common.language.service', [])
    .service('language', Language).name;