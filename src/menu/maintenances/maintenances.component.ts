import * as moment from 'moment';
import statusPage, { StatusPageService } from '../../bottom/status/status.service';

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

export default angular.module('mpdx.menu.maintenances.component', [
    statusPage
]).component('menuMaintenances', Maintenances).name;
