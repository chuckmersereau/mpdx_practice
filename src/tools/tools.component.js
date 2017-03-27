class ToolsController {
    tools;
    constructor(
        $state, $stateParams,
        tools
    ) {
        this.$state = $state;
        this.tools = tools;

        this.setup = $stateParams.setup;
    }
}

const Tools = {
    controller: ToolsController,
    template: require('./tools.html')
};

export default angular.module('mpdx.tools.component', [])
    .component('tools', Tools).name;