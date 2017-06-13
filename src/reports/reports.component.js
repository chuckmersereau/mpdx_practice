class ReportsController {
    help;
    session;

    constructor(
        gettextCatalog,
        help, session
    ) {
        this.gettextCatalog = gettextCatalog;
        this.session = session;
        this.help = help;
    }

    $onInit() {
        this.help.suggest([
            this.gettextCatalog.getString('584820bc9033600698177a95'),
            this.gettextCatalog.getString('58496cc0c6979106d373bb52'),
            this.gettextCatalog.getString('58496f15c6979106d373bb65'),
            this.gettextCatalog.getString('58481f069033600698177a78'),
            this.gettextCatalog.getString('58481e189033600698177a69'),
            this.gettextCatalog.getString('5845ac509033600698176a62'),
            this.gettextCatalog.getString('58496d4ec6979106d373bb57'),
            this.gettextCatalog.getString('58496e389033600698178180')
        ]);

        this.session.navSecondary = true;
    }

    $onDestroy() {
        this.session.navSecondary = false;
    }
}

const Reports = {
    controller: ReportsController,
    template: require('./reports.html')
};

import gettextCatalog from 'angular-gettext';
import help from 'common/help/help.service';
import session from 'common/session/session.service';

export default angular.module('mpdx.reports.component', [
    gettextCatalog,
    help, session
]).component('reports', Reports).name;
