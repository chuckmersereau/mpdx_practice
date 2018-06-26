import session from '../../common/session/session.service';

class NewsController {
    constructor(
        $window,
        session
    ) {
        this.$window = $window;
        this.session = session;
    }
    close() {
        this.$window.localStorage.setItem('useNext', false);
        this.session.hasNews = false;
    }
    go() {
        this.$window.localStorage.setItem('useNext', true);
        this.$window.location.href = 'https://next.mpdx.org';
    }
}

const News = {
    template: require('./news.html'),
    controller: NewsController
};

export default angular.module('mpdx.menu.news.component', [
    session
]).component('newsBanner', News).name;