class SourceToStrFilter {
    constructor(gettextCatalog) {
        this.gettextCatalog = gettextCatalog;
        return (str) => {
            switch (str) {
                case 'Siebel':
                    return this.gettextCatalog.getString('US Donation Services');
                case 'DataServer':
                    return this.gettextCatalog.getString('DonorHub');
                case 'MPDX':
                    return this.gettextCatalog.getString('MPDX');
                case 'TntImport':
                    return this.gettextCatalog.getString('Tnt Import');
                case 'GoogleImport':
                    return this.gettextCatalog.getString('Google Import');
                default:
                    return str;
            }
        };
    }
    static sourceToStrFactory(gettextCatalog) {
        return new SourceToStrFilter(gettextCatalog);
    }
}

SourceToStrFilter.sourceToStrFactory.$inject = ['gettextCatalog'];

export default angular.module('mpdx.common.sourceToStr', [])
    .filter('sourceToStr', SourceToStrFilter.sourceToStrFactory).name;
