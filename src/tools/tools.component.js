class ToolsController {
    toolsService;
    constructor(
        $state,
        tools
    ) {
        this.$state = $state;
        this.tools = tools;
    }
}

const Tools = {
    controller: ToolsController,
    template: require('./tools.html')
};

export default angular.module('mpdx.tools.component', [])
    .component('tools', Tools).name;