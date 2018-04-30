class UrlParameterService {
    constructor(private $window: ng.IWindowService) {}
    get(nameFromUri) {
        return decodeURIComponent(
            (new RegExp('[?|&]' + nameFromUri + '=([^&;]+?)(&|#|;|$)').exec(this.$window.location.search)
                || [''])[1].replace(/\+/g, '%20'))
            || null;
    }
}
export default angular.module('mpdx.common.urlParameter.service', [])
    .service('urlParameter', UrlParameterService).name;
