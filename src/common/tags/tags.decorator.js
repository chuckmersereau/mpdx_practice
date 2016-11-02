function TagsDecorator($provide) {
    $provide.decorator('tasksTagsService', decoratorFunction);
    function decoratorFunction($delegate, $rootScope, $filter, api, accountsService) {
        let svc = $delegate;
        svc.data = [];
        svc.selectedTags = [];
        svc.rejectedTags = [];
        svc.anyTags = false;
        svc.loading = true;
        var singularCtx = svc.singularCtx;
        var pluralCtx = svc.pluralCtx;
        var endpoint = pluralCtx + '/tags';


        svc.load = function() {
            svc.loading = true;
            api.get(endpoint, {}, function(data) {
                svc.data = data;
                console.log(svc.data);
                svc.loading = false;
            });
        };

        svc.delete = function(tagName) {
            var obj = {
                tags: [{
                    name: tagName
                }]
            };
            obj['tags'][0]['all_' + pluralCtx] = true;
            api.delete(endpoint, obj, function() {
                svc.selectedTags = _.without(tagName);
                svc.rejectedTags = _.without(tagName);
                svc.data.splice(svc.data.indexOf(tagName), 1);
            });
        };

        svc.tag = function(contextIds, tag, cb) {
            var obj = {
                add_tag_name: tag
            };
            obj['add_tag_' + singularCtx + '_ids'] = contextIds.join();
            api.post(
                endpoint + '/bulk_create',
                obj,
                cb
            );
        };

        svc.untag = function(contextIds, tag, cb) {
            var obj = {
                tags: [{
                    name: tag
                }]
            };
            obj['tags'][0][singularCtx + '_ids'] = contextIds.join();
            api.delete(
                endpoint,
                obj,
                cb
            );
        };

        svc.isTagActive = function(tag) {
            if (svc.selectedTags.length === 0) {
                return true;
            } else {
                if (svc.selectedTags.indexOf(tag) >= 0) {
                    return true;
                } else {
                    return false;
                }
            }
        };

        svc.isTagRejected = function(tag) {
            return svc.rejectedTags.indexOf(tag) >= 0;
        };

        svc.tagClick = function(tag) {
            if (svc.selectedTags.indexOf(tag) >= 0) {
                svc.selectedTags = _.without(svc.selectedTags, tag);
                svc.rejectedTags = _.concat(svc.rejectedTags, tag);
            } else if (svc.rejectedTags.indexOf(tag) >= 0) {
                svc.rejectedTags = _.without(svc.rejectedTags, tag);
            } else {
                svc.selectedTags = _.concat(svc.selectedTags, tag);
            }
        };

        svc.isResettable = function() {
            return (svc.selectedTags.length > 0 || svc.rejectedTags.length > 0);
        };

        svc.reset = function() {
            svc.selectedTags = [];
            svc.rejectedTags = [];
        };

        svc.getTagsByQuery = function(query) {
            return $filter('filter')(svc.data, query);
        };

        svc.load();

        $rootScope.$watch(function() {
            return accountsService.account_list_id;
        }, function watchCallback(accountListId) {
            if (accountListId) {
                svc.load();
            }
        });

        return svc;
    }
}

export default angular.module('mpdx.common.tags.decorator', [])
    .config(TagsDecorator).name;
