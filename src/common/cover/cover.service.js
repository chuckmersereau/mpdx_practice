
class BackgroundService {
    constructor() {
        this.covers = [
            {
                'url': require('./images/bg_1.jpg'),
                'copyright': 'Wichita Mountains National Wildlife Refuge, Oklahoma (© Tim Fitzharris/Minden Pictures)'
            }, {
                'url': require('./images/bg_2.jpg'),
                'copyright': 'Kintamani, Bali, Indonesia (© Bobby Joshi/500px)'
            }, {
                'url': require('./images/bg_3.jpg'),
                'copyright': 'Aurora borealis over the Arctic Henge in Raufarhöfn, Iceland (© Stian Rekdal/Nimia)'
            }
        ];
    }
}

export default angular.module('mpdx.common.cover.service', [])
    .service('cover', BackgroundService).name;
