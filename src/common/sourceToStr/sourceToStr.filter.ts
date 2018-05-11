import 'angular-gettext';

function SourceToStrFilter(
    gettextCatalog: ng.gettext.gettextCatalog
) {
    return (str) => {
        switch (str) {
            case 'Siebel':
                return gettextCatalog.getString('US Donation Services');
            case 'DataServer':
                return gettextCatalog.getString('DonorHub');
            case 'MPDX':
                return gettextCatalog.getString('MPDX');
            case 'TntImport':
                return gettextCatalog.getString('Tnt Import');
            case 'GoogleImport':
                return gettextCatalog.getString('Google Import');
            default:
                return str;
        }
    };
}

export default angular.module('mpdx.common.sourceToStr', [
    'gettext'
]).filter('sourceToStr', SourceToStrFilter).name;
