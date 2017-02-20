class Google {
    api;

    constructor(
        $log,
        api
    ) {
        this.$log = $log;
        this.api = api;

        this.data = null;
        this.selected_account = null;
    }
    load() {
        return this.api.get('user/google_accounts').then((data) => {
            this.$log.debug('user/google_accounts', data);
            this.data = data;
            if (this.data.length === 1) {
                this.selected_account = this.data[0];
                this.selectedAccountUpdated(this.selected_account);
            }
        });
    }
}

export default angular.module('mpdx.preferences.import.google.services', [])
    .service('google', Google).name;