class StateService {
    constructor() {
        this.current_currency = '';
        this.current_currency_symbol = '';
        this.contact_limit = null;
    }
}
export default angular.module('mpdx.common.state.service', [])
    .service('state', StateService).name;
