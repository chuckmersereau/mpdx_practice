interface ICover {
    url: string;
    copyright: string;
}

class CoverController {
    cover: ICover;
    covers: ICover[];
    constructor() {
        this.covers = [
            {
                'url': require('./images/splash_sf.jpg'),
                'copyright': 'San Francisco, California'
            }, {
                'url': require('./images/splash_machu.jpg'),
                'copyright': 'Machu Picchu, Peru'
            }, {
                'url': require('./images/splash_china.jpg'),
                'copyright': 'Guilin, China'
            }
        ];

        this.cover = this.covers[Math.floor(Math.random() * this.covers.length)];
    }
}

const Cover = {
    controller: CoverController,
    template: require('./cover.html'),
    transclude: true
};

export default angular.module('mpdx.common.cover.component', [])
    .component('cover', Cover).name;
