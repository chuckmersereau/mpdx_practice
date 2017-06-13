import service from './tools.service';

describe('tools.service', () => {
    let tools;

    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _tools_) => {
            tools = _tools_;
        });
    });

    describe('constructor', () => {
        it('should set default values', () => {
            expect(tools.data).toEqual([
                { title: 'Goals & Appeals',
                    icon: 'fa fa-trophy',
                    link: 'tools.goalsAndAppeals',
                    description: 'Set goals, create asks, and track progress for one time needs',
                    enabled: false },
                { title: 'Import from Google',
                    icon: 'fa fa-google',
                    link: 'tools.import.google',
                    description: 'Import your contact information from your Google account',
                    enabled: true,
                    imports: true },
                { title: 'Import from CSV',
                    icon: 'fa fa-table',
                    link: 'tools.import.csv',
                    description: 'Import contacts you have saved in a CSV file',
                    enabled: true,
                    imports: true },
                { title: 'Import from TntConnect',
                    icon: 'fa fa-cloud-upload',
                    link: 'tools.import.tnt',
                    description: 'Import your contacts from your TntConnect database',
                    enabled: true,
                    imports: true },
                { title: 'Fix Commitment Info',
                    icon: 'fa fa-usd',
                    link: 'tools.fix.commitmentInfo',
                    description: 'Set the correct contacts commitment info for each contact',
                    enabled: true },
                { title: 'Fix Phone Numbers',
                    icon: 'fa fa-phone-square',
                    link: 'tools.fix.phoneNumbers',
                    description: 'Set the correct primary phone number for each person',
                    enabled: true },
                { title: 'Fix Email Addresses',
                    icon: 'fa fa-envelope-o',
                    link: 'tools.fix.emailAddresses',
                    description: 'Set the correct primary email address for each person',
                    enabled: true },
                { title: 'Fix Mailing Addresses',
                    icon: 'fa fa-map',
                    link: 'tools.fix.addresses',
                    description: 'Set the correct primary mailing address for each contact',
                    enabled: true },
                { title: 'Merge Contacts',
                    icon: 'fa fa-users',
                    link: 'tools.merge.contacts',
                    description: 'Review and merge duplicate contacts',
                    enabled: true },
                { title: 'Merge People',
                    icon: 'fa fa-exchange',
                    link: 'tools.merge.people',
                    description: 'Review and merge duplicate people',
                    enabled: true }
            ]);
        });
    });
});
