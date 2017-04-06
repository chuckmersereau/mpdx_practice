class ToolsController {
    tools;
    help;
    constructor(
        $state, $stateParams,
        tools, help
    ) {
        this.$state = $state;
        this.tools = tools;

        help.suggest([
            '58d3d70ddd8c8e7f5974d3ca',
            '5845aa229033600698176a54',
            '584715b890336006981774d2',
            '5845a6de9033600698176a43',
            '58496d4ec6979106d373bb57',
            '58496e389033600698178180',
            '58a47007dd8c8e56bfa7b7a4'
        ]);

        this.setup = $stateParams.setup;
    }
}

const Tools = {
    controller: ToolsController,
    template: require('./tools.html')
};

export default angular.module('mpdx.tools.component', [])
    .component('tools', Tools).name;
