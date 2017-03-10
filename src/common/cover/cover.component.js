class CoverController {
    constructor(cover) {
        this.cover = cover.covers[Math.floor(Math.random() * cover.covers.length)];
    }
}

const Cover = {
    controller: CoverController,
    template: require('./cover.html'),
    transclude: true
};

export default angular.module('mpdx.common.cover.component', [])
    .component('cover', Cover).name;
