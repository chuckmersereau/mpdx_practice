class SetupGoogleController {
    users;
    constructor(
        users
    ) {
        this.users = users;
    }
    $onInit() {
        this.users.current.options.setup_position.value = 'google';
        this.users.setOption(this.users.current.options.setup_position);
    }
}

const SetupGoogle = {
    template: `<google-import-form setup="true"></google-import-form>`,
    controller: SetupGoogleController
};

export default angular.module('mpdx.setup.google', [])
    .component('setupGoogle', SetupGoogle).name;