import * as moment from 'moment';

class MaintenancesController {
    moment: any;
    constructor(
        private statusPage: StatusPageService
    ) {
        this.statusPage = statusPage;
        this.moment = moment;
    }
}

const Maintenances = {
    controller: MaintenancesController,
    template: require('./maintenances.html')
};

import statusPage, {StatusPageService} from "../../bottom/status/status.service";

export default angular.module('mpdx.menu.maintenances.component', [
    statusPage
]).component('menuMaintenances', Maintenances).name;
