const SetupGoogle = {
    template: `<google-import-form setup="true"></google-import-form>`
};

export default angular.module('mpdx.setup.google', [])
    .component('setupGoogle', SetupGoogle).name;