import accountLists from './accountLists/accountLists.component';
import component from './menu.component';
import balances from './balances/balances.component';
import impersonationBar from './impersonationBar/impersonationBar.component';
import incidents from './incidents/incidents.component';
import maintenances from './maintenances/maintenances.component';
import search from './search/search.component';

export default angular.module('mpdx.menu', [
    accountLists,
    component,
    balances,
    impersonationBar,
    incidents,
    maintenances,
    search
]).name;
