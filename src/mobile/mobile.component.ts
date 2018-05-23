import * as bowser from 'bowser';

class MobileController {
    isAndroid: boolean;
    isIos: boolean;
    isMobile: boolean;
    $onInit() {
        this.isAndroid = bowser.android;
        this.isIos = bowser.ios;
        this.isMobile = this.isAndroid || this.isIos;
    }
}

const Mobile = {
    template: require('./mobile.html'),
    controller: MobileController
};

export default angular.module('mpdx.mobile.component', [
]).component('mobile', Mobile).name;
