class ServerConstantsService {
    api;

    constructor(
        api,
        $log, $q
    ) {
        this.$log = $log;
        this.$q = $q;
        this.api = api;

        this.data = null;

        // // FIXME temporary hack. remove when the endpoint '/constants' is working.
        // let options = {};
        // options['Call'] = ['Call Again', 'Email', 'Text', 'Message', 'Talk to In Person', 'Cultivate Relationship', 'Appointment Scheduled', 'Partner - Financial', 'Partner - Special', 'Partner - Pray', 'Ask in Future', 'Not Interested', 'None', 'Prayer Request', 'Thank'];
        // options['Appointment'] = ['Call for Decision', 'Call', 'Email', 'Text', 'Message', 'Talk to In Person', 'Cultivate Relationship', 'Partner - Financial', 'Partner - Special', 'Partner - Pray', 'Ask in Future', 'Not Interested', 'Reschedule', 'None', 'Prayer Request', 'Thank'];
        // options['Email'] = ['Email Again', 'Call', 'Text', 'Message', 'Talk to In Person', 'Cultivate Relationship', 'Appointment Scheduled', 'Partner - Financial', 'Partner - Special', 'Partner - Pray', 'Ask in Future', 'Not Interested', 'None', 'Prayer Request', 'Thank'];
        // options['Facebook Message'] = ['Message Again', 'Call', 'Email', 'Text', 'Talk to In Person', 'Cultivate Relationship', 'Appointment Scheduled', 'Partner - Financial', 'Partner - Special', 'Partner - Pray', 'Ask in Future', 'Not Interested', 'None', 'Prayer Request', 'Thank'];
        // options['Text Message'] = ['Text Again', 'Call', 'Email', 'Message', 'Talk to In Person', 'Cultivate Relationship', 'Appointment Scheduled', 'Partner - Financial', 'Partner - Special', 'Partner - Pray', 'Ask in Future', 'Not Interested', 'None', 'Prayer Request', 'Thank'];
        // options['Talk to In Person'] = ['Talk to In Person Again', 'Call', 'Email', 'Message', 'Text', 'Cultivate Relationship', 'Appointment Scheduled', 'Partner - Financial', 'Partner - Special', 'Partner - Pray', 'Ask in Future', 'Not Interested', 'None', 'Prayer Request', 'Thank'];
        // options['Prayer Request'] = ['Prayer Request', 'Call', 'Email', 'Message', 'Text', 'Talk to In Person', 'Cultivate Relationship', 'Appointment Scheduled', 'Partner - Financial', 'Partner - Special', 'Partner - Pray', 'Ask in Future', 'Not Interested', 'None', 'Thank'];
        // options['Pre Call Letter'] = ['Call to Follow Up', 'Email', 'Text', 'Message', 'Talk to In Person', 'None'];
        // options['Reminder Letter'] = ['Call to Follow Up', 'Email', 'Text', 'Message', 'Talk to In Person', 'None'];
        // options['Support Letter'] = ['Call to Follow Up', 'Email', 'Text', 'Message', 'Talk to In Person', 'None'];
        // options['default'] = ['None'];
        // this.data['next_actions'] = options;
        // options = {};
        // options['Call'] = ['Attempted - Left Message', 'Attempted', 'Completed', 'Received'];
        // options['Appointment'] = ['Completed', 'Attempted'];
        // options['Email'] = ['Completed', 'Received'];
        // options['Facebook Message'] = ['Completed', 'Received'];
        // options['Text Message'] = ['Completed', 'Received'];
        // options['Talk to In Person'] = ['Completed'];
        // options['Prayer Request'] = ['Completed'];
        // options['default'] = ['Done'];
        // this.data['results'] = options;
        // // FIXME END
    }
    load(reset = false) {
        if (!reset && this.data) {
            return this.$q.resolve(this.data);
        }
        return this.api.get('constants').then((data) => {
            this.$log.debug('constants', data);
            this.data = data;
            return data;
        });
    }
}

export default angular.module('mpdx.common.serverConstants', [])
    .service('serverConstants', ServerConstantsService).name;
