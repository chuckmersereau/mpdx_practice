import each from 'lodash/fp/each';
import map from 'lodash/fp/map';
import relationshipId from 'common/fp/relationshipId';
import filter from 'lodash/fp/filter';

class MergePeople {
    constructor(
        $log, $q,
        api, people, tools
    ) {
        this.$q = $q;
        this.$log = $log;
        this.api = api;
        this.people = people;
        this.tools = tools;

        this.duplicates = [];
        this.perPage = 5;
    }

    load(reset = false) {
        if (!reset && this.duplicates.length !== 0) {
            return this.$q.resolve(this.duplicates);
        }

        return this.api.get({
            url: 'contacts/people/duplicates',
            data: {
                include: 'people,people.phone_numbers,people.email_addresses',
                fields: {
                    people: 'avatar,email_addresses,phone_numbers,first_name,last_name,created_at',
                    phone_numbers: 'primary,number,source',
                    email_addresses: 'primary,email,source',
                    person_duplicates: 'people,shared_contact'
                },
                filter: { account_list_id: this.api.account_list_id },
                per_page: this.perPage
            },
            deSerializationOptions: relationshipId('contacts') // for shared_contact
        }).then((data) => {
            this.$log.debug('contacts/people/duplicates', data);
            this.setMeta(data.meta);
            this.duplicates = map((person) => {
                person.mergeChoice = -1;
                return person;
            }, data);
        });
    }

    setMeta(meta) {
        this.meta = meta;

        if (this.meta && this.meta.pagination && this.meta.pagination.total_count && this.tools.analytics) {
            this.tools.analytics['duplicate-people'] = this.meta.pagination.total_count;
        }
    }

    merge(duplicates) {
        const winnersAndLosers = map(duplicate => {
            if (duplicate.mergeChoice === 0) {
                return { winner_id: duplicate.people[0].id, loser_id: duplicate.people[1].id };
            }
            return { winner_id: duplicate.people[1].id, loser_id: duplicate.people[0].id };
        }, duplicates);

        return this.people.bulkMerge(winnersAndLosers);
    }

    ignore(duplicates) {
        let promises = [];
        each(duplicate => {
            promises.push(this.api.delete({ url: `contacts/people/duplicates/${duplicate.id}`, type: 'people' }));
        }, duplicates);

        return this.$q.all(promises);
    }

    confirm(promises = []) {
        const peopleToMerge = filter(duplicate => {
            return duplicate.mergeChoice === 0 || duplicate.mergeChoice === 1;
        }, this.duplicates);
        const peopleToIgnore = filter({ mergeChoice: 2 }, this.duplicates);
        if (peopleToMerge.length > 0) {
            promises.push(this.merge(peopleToMerge));
        }
        if (peopleToIgnore.length > 0) {
            promises.push(this.ignore(peopleToIgnore));
        }

        return this.$q.all(promises).then(() => this.load(true));
    }
}

import uiRouter from '@uirouter/angularjs';
import api from 'common/api/api.service';
import people from 'contacts/show/people/people.service';
import tools from 'tools/tools.service';

export default angular.module('mpdx.tools.merge.people.service', [
    uiRouter,
    api, people, tools
]).service('mergePeople', MergePeople).name;
