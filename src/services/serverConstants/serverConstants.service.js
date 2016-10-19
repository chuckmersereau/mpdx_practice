class ServerConstantsService {
    api;

    constructor(api, $q) {
        this.$q = $q;
        this.api = api;

        this.data = {};
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
    }
    //tasks/next_actions   tasks/actions   tasks/results
    fetchConstant(constantName, url, cb) {
        if (!_.get(this.isFetching.constants, constantName, false)) {
            this.isFetching.constants[constantName] = true;
            let promise = this.api.get(url, {}).then((data) => {
                this.data[constantName] = data;
                if (cb) {
                    cb();
                }
                this.isFetching.constants[constantName] = false;
            });
            this.fetchPromises[constantName] = promise;
            return promise;
        }
        return this.fetchPromises[constantName];
    }
    fetchConstants(constantsNames, cb) {
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
            {include: fetchConstantsNames, exclude: excludeConstantsNames}
        ).then((data) => {
            _.mapKeys(data, (val, key) => {
                this.data[key] = val;
                this.isFetching.constants[key] = false;

                if (fetchConstantsNames.length === 0) {
                    this.isFetching.all = false;
                }
            });

            if (cb) {
                cb();
            }
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
}

export default angular.module('mpdx.services.serverConstants', [])
    .service('serverConstants', ServerConstantsService).name;
