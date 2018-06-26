import accountLists from './accountLists/accountLists.component';
import component from './menu.component';
import balances from './balances/balances.component';
import impersonationBar from './impersonationBar/impersonationBar.component';
import news from './news/news.component';
import search from './search/search.component';

export default angular.module('mpdx.menu', [
    accountLists,
    component,
    balances,
    impersonationBar,
    news,
    search
]).name;