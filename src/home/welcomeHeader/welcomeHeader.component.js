class welcomeHeaderController {
    flash;
    users;

    constructor(flash, gettextCatalog, users) {
        this._ = _;
        this.flash = flash;
        this.gettextCatalog = gettextCatalog;
        this.users = users;
        this.tourComplete = false;
    }
    $onInit() {
        this.sources = [
            ['TntMPD', 'Tnt'],
            [this.gettextCatalog.getString('.CSV File'), 'CSV']
        ];

        this.tutorials = [
            ['https://www.gcx.org/mpdxhelp/about/', 'Take a tour'],
            ['https://www.gcx.org/mpdxhelp/2015/07/01/organizing-your-contacts/', 'Organize Your Contacts'],
            ['https://www.youtube.com/watch?v=ui6snOtmd50', 'Contact Filters and Tags'],
            ['https://www.youtube.com/watch?v=3m3E1CRRoq4', 'Add/Edit in Bulk'],
            ['https://www.youtube.com/watch?v=ijy4UzZqN8I', 'Add a Task'],
            ['https://www.youtube.com/watch?v=3RWae_Sj8u8', 'Task Filters and Tags'],
            ['https://www.gcx.org/mpdxhelp/track-appeals-and-goals/', 'Track an Appeal or Goal']
        ];
    }

    setPreferences() {
        // form submit for previous form_for preference_set, url: preference_path(current_user, redirect: home_path), method: :put do |f| %>
    }
}

const welcomeHeaderComponent = {
    controller: welcomeHeaderController,
    template: require('./welcomeHeader.html')
};

export default angular.module('mpdx.home.welcomeHeader', [])
    .component('welcomeHeader', welcomeHeaderComponent).name;

