
class BackgroundService {
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
    }
}

export default angular.module('mpdx.common.cover.service', [])
    .service('cover', BackgroundService).name;
