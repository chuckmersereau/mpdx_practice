class ToolsController {
    tools;
    help;
    constructor(
        $state, $stateParams, gettextCatalog,
        tools, help
    ) {
        this.$state = $state;
        this.gettextCatalog = gettextCatalog;

        this.tools = tools;

        help.suggest([
            this.gettextCatalog.getString('5845aa229033600698176a54'),
            this.gettextCatalog.getString('584715b890336006981774d2'),
            this.gettextCatalog.getString('5845a6de9033600698176a43'),
            this.gettextCatalog.getString('58496d4ec6979106d373bb57'),
            this.gettextCatalog.getString('58496e389033600698178180'),
            this.gettextCatalog.getString('58a47007dd8c8e56bfa7b7a4')
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
