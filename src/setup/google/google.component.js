class SetupGoogleController {
    constructor(
        users
    ) {
        users.current.options.setup_position.value = 'google';
        users.setOption(users.current.options.setup_position);
    }
}

const SetupGoogle = {
    template: `<google-import-form setup="true"></google-import-form>`,
    controller: SetupGoogleController
};

export default angular.module('mpdx.setup.google', [])
    .component('setupGoogle', SetupGoogle).name;