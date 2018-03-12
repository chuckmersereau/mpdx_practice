import config from 'config';

class Language {
    constructor(
        gettextCatalog,
        api
    ) {
        this.api = api;
        this.gettextCatalog = gettextCatalog;
        this.dateTimeFormat = null;
    }
    change(language) {
        let temp = angular.copy(language);
        // hardcoded until the data is fixed
        switch (language) {
            case 'fr-fr':
                language = 'fr_FR';
                temp = 'fr-FR';
                break;
            case 'es-419':
                language = 'es_419';
                break;
            case 'zh-hans-cn':
                language = 'zh_Hans_CN';
                temp = 'zh-Hans-CN';
                break;
            case 'en-us':
                language = 'en_us';
                temp = 'en-US';
                break;
            case 'fr-ca':
                temp = 'fr-CA';
                language = 'fr_ca';
                break;
            case 'pt-br':
                temp = 'pt-BR';
                language = 'pt_br';
                break;
            case 'nl-nl':
                temp = 'nl-NL';
                language = 'nl_nl';
                break;
        }
        this.api.language = language;
        this.gettextCatalog.setCurrentLanguage(language);

        if (config.env !== 'development') {
            this.gettextCatalog.loadRemote(`locale/${temp}-${process.env.TRAVIS_COMMIT}.json`);
        }
    }
}

import api from 'common/api/api.service';
import gettext from 'angular-gettext';

export default angular.module('mpdx.common.language.service', [
    gettext,
    api
]).service('language', Language).name;