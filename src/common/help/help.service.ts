import { find } from 'lodash/fp';
import config from '../../config';

declare global {
    const HS: any;
}

const HSMock = {
    beacon: {
        config: () => {},
        ready: () => {}
    }
};

// Do not inject help service into modules.... Instead load HelpMock for testing
export function HelpMock($provide) {
    $provide.value('help', ({
        showHelp: () => {},
        showArticle: () => {},
        updateUser: () => {},
        suggest: () => {}
    }));
}

/* global HS*/
export class HelpService {
    constructor(
        $log: ng.ILogService,
        private gettextCatalog: ng.gettext.gettextCatalog
    ) {
        if (config.env === 'test') {
            (window as any).HS = HSMock;
            return;
        }
        HS.beacon.config({
            color: '#05699B',
            icon: 'question',
            topArticles: true,
            translation: {
                searchLabel: this.gettextCatalog.getString('What can we help you with?'),
                searchErrorLabel: this.gettextCatalog.getString('Your search timed out. Please double-check your internet connection and try again.'),
                noResultsLabel: this.gettextCatalog.getString('No results found for'),
                contactLabel: this.gettextCatalog.getString('Send a Message'),
                attachFileLabel: this.gettextCatalog.getString('Attach a file'),
                attachFileError: this.gettextCatalog.getString('The maximum file size is 10mb'),
                fileExtensionError: this.gettextCatalog.getString('The file format you uploaded is not allowed.'),
                nameLabel: this.gettextCatalog.getString('Your Name'),
                nameError: this.gettextCatalog.getString('Please enter your name'),
                emailLabel: this.gettextCatalog.getString('Email address'),
                emailError: this.gettextCatalog.getString('Please enter a valid email address'),
                topicLabel: this.gettextCatalog.getString('Select a topic'),
                topicError: this.gettextCatalog.getString('Please select a topic from the list'),
                subjectLabel: this.gettextCatalog.getString('Subject'),
                subjectError: this.gettextCatalog.getString('Please enter a subject'),
                messageLabel: this.gettextCatalog.getString('How can we help you?'),
                messageError: this.gettextCatalog.getString('Please enter a message'),
                sendLabel: this.gettextCatalog.getString('Send'),
                contactSuccessLabel: this.gettextCatalog.getString('Message sent!'),
                contactSuccessDescription: this.gettextCatalog.getString('Thanks for reaching out! Someone from our team will get back to you soon.')
            },
            zIndex: 10003,
            poweredBy: false,
            showSubject: true,
            autoInit: true
        });
        try {
            HS.beacon.init();
        } catch (err) {
            $log.debug('Help Service', err);
        }
    }
    showHelp(): void {
        HS.beacon.open();
    }
    showArticle(articleId: string): void {
        HS.beacon.show(articleId);
    }
    updateUser(user: any): void {
        if (!user) { return; }
        const primaryEmailAddress = find(['primary', true], user.email_addresses);
        HS.beacon.ready(() => {
            HS.beacon.identify({
                id: user.id,
                email: primaryEmailAddress ? primaryEmailAddress.email : null,
                name: `${user.first_name} ${user.last_name}`
            });
        });
    }
    suggest(articleIds: string[]): void {
        HS.beacon.ready(() => {
            HS.beacon.suggest(articleIds);
        });
    }
}

import 'angular-gettext';

export default angular.module('mpdx.common.help', [
    'gettext'
]).service('help', HelpService).name;
