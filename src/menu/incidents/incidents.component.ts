import * as moment from 'moment';
import statusPage, { StatusPageService } from '../../bottom/status/status.service';

class IncidentsController {
    moment: any;
    constructor(
        private statusPage: StatusPageService
    ) {
        this.statusPage = statusPage;
        this.moment = moment;
    }
}

const Incidents = {
    controller: IncidentsController,
    template: require('./incidents.html')
};

export default angular.module('mpdx.menu.incidents.component', [
    statusPage
]).component('menuIncidents', Incidents).name;
