class ServerConstantsService {
    api;

    constructor(
        api,
        $log, $q
    ) {
        this.$log = $log;
        this.$q = $q;
        this.api = api;

        this.data = {
            contacts: {},
            no_appeals_options: {},
            mail_chimp_locale_options: {}
        };
        this.loading = true;

        this.isFetching = {
            all: false,
            actions: false,
            nextActions: false,
            results: false,
            bulkUpdateOptions: false,
            constants: {}
        };

        this.fetchPromises = {};

        // FIXME temporary hack. remove when the endpoint '/constants' is working.
        this.data['actions'] = ['Call', 'Appointment', 'Email', 'Text Message', 'Facebook Message', 'Letter', 'Newsletter', 'Pre Call Letter', 'Reminder Letter', 'Support Letter', 'Thank', 'To Do', 'Talk to In Person', 'Prayer Request'];
        let options = {};
        options['Call'] = ['Call Again', 'Email', 'Text', 'Message', 'Talk to In Person', 'Cultivate Relationship', 'Appointment Scheduled', 'Partner - Financial', 'Partner - Special', 'Partner - Pray', 'Ask in Future', 'Not Interested', 'None', 'Prayer Request', 'Thank'];
        options['Appointment'] = ['Call for Decision', 'Call', 'Email', 'Text', 'Message', 'Talk to In Person', 'Cultivate Relationship', 'Partner - Financial', 'Partner - Special', 'Partner - Pray', 'Ask in Future', 'Not Interested', 'Reschedule', 'None', 'Prayer Request', 'Thank'];
        options['Email'] = ['Email Again', 'Call', 'Text', 'Message', 'Talk to In Person', 'Cultivate Relationship', 'Appointment Scheduled', 'Partner - Financial', 'Partner - Special', 'Partner - Pray', 'Ask in Future', 'Not Interested', 'None', 'Prayer Request', 'Thank'];
        options['Facebook Message'] = ['Message Again', 'Call', 'Email', 'Text', 'Talk to In Person', 'Cultivate Relationship', 'Appointment Scheduled', 'Partner - Financial', 'Partner - Special', 'Partner - Pray', 'Ask in Future', 'Not Interested', 'None', 'Prayer Request', 'Thank'];
        options['Text Message'] = ['Text Again', 'Call', 'Email', 'Message', 'Talk to In Person', 'Cultivate Relationship', 'Appointment Scheduled', 'Partner - Financial', 'Partner - Special', 'Partner - Pray', 'Ask in Future', 'Not Interested', 'None', 'Prayer Request', 'Thank'];
        options['Talk to In Person'] = ['Talk to In Person Again', 'Call', 'Email', 'Message', 'Text', 'Cultivate Relationship', 'Appointment Scheduled', 'Partner - Financial', 'Partner - Special', 'Partner - Pray', 'Ask in Future', 'Not Interested', 'None', 'Prayer Request', 'Thank'];
        options['Prayer Request'] = ['Prayer Request', 'Call', 'Email', 'Message', 'Text', 'Talk to In Person', 'Cultivate Relationship', 'Appointment Scheduled', 'Partner - Financial', 'Partner - Special', 'Partner - Pray', 'Ask in Future', 'Not Interested', 'None', 'Thank'];
        options['Pre Call Letter'] = ['Call to Follow Up', 'Email', 'Text', 'Message', 'Talk to In Person', 'None'];
        options['Reminder Letter'] = ['Call to Follow Up', 'Email', 'Text', 'Message', 'Talk to In Person', 'None'];
        options['Support Letter'] = ['Call to Follow Up', 'Email', 'Text', 'Message', 'Talk to In Person', 'None'];
        options['default'] = ['None'];
        this.data['next_actions'] = options;
        options = {};
        options['Call'] = ['Attempted - Left Message', 'Attempted', 'Completed', 'Received'];
        options['Appointment'] = ['Completed', 'Attempted'];
        options['Email'] = ['Completed', 'Received'];
        options['Facebook Message'] = ['Completed', 'Received'];
        options['Text Message'] = ['Completed', 'Received'];
        options['Talk to In Person'] = ['Completed'];
        options['Prayer Request'] = ['Completed'];
        options['default'] = ['Done'];
        this.data['results'] = options;
        // FIXME END
    }
    //tasks/next_actions   tasks/actions   tasks/results
    fetchConstant(constantName, url) {
        if (!_.get(this.isFetching.constants, constantName, false)) {
            this.isFetching.constants[constantName] = true;
            let promise = this.api.get(url).then((data) => {
                this.data[constantName] = data;
                this.isFetching.constants[constantName] = false;
            });
            this.fetchPromises[constantName] = promise;
            return promise;
        }
        return this.fetchPromises[constantName];
    }
    fetchConstants(constantsNames) {
        if (this.isFetching.all === true) {
            return this.fetchPromises.all;
        }

        let fetchConstantsNames = [];
        let excludeConstantsNames = [];

        if (constantsNames.length > 0) {
            _.each(constantsNames, (constantName) => {
                if (this._shouldFetch(constantName)) {
                    fetchConstantsNames.push(constantName);
                    this.isFetching.constants[constantName] = true;
                }
            });

            if (fetchConstantsNames.length === 0) {
                return this.$q.all(
                    _.map(constantsNames, key => this.fetchPromises[key])
                );
            }
        } else {
            this.isFetching.all = true;
            _.mapKeys(this.isFetching.constants, (val, key) => {
                if (this.isFetching.constants[key] === true) {
                    excludeConstantsNames.push(key);
                }
            });
        }

        let promise = this.api.get('constants',
            {include: fetchConstantsNames.join(','), exclude: excludeConstantsNames.join(',')}
        ).then((data) => {
            _.mapKeys(data, (val, key) => {
                this.data[key] = val;
                this.isFetching.constants[key] = false;

                if (fetchConstantsNames.length === 0) {
                    this.isFetching.all = false;
                }
            });
        });
        const keys = _.difference(fetchConstantsNames, excludeConstantsNames);
        _.each(keys, (key) => {
            this.fetchPromises[key] = promise;
        });
        return promise;
    }
    _shouldFetch(constantName) {
        return !(this.data[constantName] || this.isFetching.constants[constantName]);
    }
    list() {
        return this.api.get('constants').then((data) => {
            this.$log.debug('constants', data);
            // _.mapKeys(data, (val, key) => {
            //     this.data[key] = val;
            //     this.isFetching.constants[key] = false;
            //
            //     if (fetchConstantsNames.length === 0) {
            //         this.isFetching.all = false;
            //     }
            // });
        });
    }
}

export default angular.module('mpdx.common.serverConstants', [])
    .service('serverConstants', ServerConstantsService).name;
