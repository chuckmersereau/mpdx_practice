import isArray from 'lodash/fp/isArray';
import isObject from 'lodash/fp/isObject';
import map from 'lodash/fp/map';

const ifNotObject = (tag) => {
    if (!isObject(tag)) {
        return { name: tag };
    }
    return tag;
};

class TagSelectorController {
    constructor(
        $filter
    ) {
        this.$filter = $filter;
        this.tags = [];
    }
    $onInit() {
        this.init();
    }
    init() {
        // make sure ngModel is an array before we try to modify it
        if (!isArray(this.ngModel)) {
            this.ngModel = [];
        }
        const tagList = this.tagList;
        // map to tag object if array of names
        this.tags = map(ifNotObject, tagList);
        this.selectedTags = angular.copy(this.ngModel);
    }
    // keep reference to this.ngModel, don't use fp below
    addTag($tag) {
        this.ngModel.push($tag.name);
    }
    removeTag($tag) {
        const index = this.ngModel.indexOf($tag.name);
        if (index > -1) {
            this.ngModel.splice(index, 1);
        }
    }
    filterTags($query) {
        return this.$filter('filter')(this.tags, $query);
    }
}

const TagSelector = {
    template: require('./tagSelector.html'),
    controller: TagSelectorController,
    bindings: {
        ngModel: '=',
        tagList: '<',
        onTagAdded: '&',
        onTagRemoved: '&'
    }
};

export default angular.module('mpdx.common.tagSelector.component', [])
    .component('tagSelector', TagSelector).name;