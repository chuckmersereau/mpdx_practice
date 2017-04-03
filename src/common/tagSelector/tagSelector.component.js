import concat from 'lodash/fp/concat';
import isArray from 'lodash/fp/isArray';
import isObject from 'lodash/fp/isObject';
import map from 'lodash/fp/map';
import pull from 'lodash/fp/pull';

const ifNotObject = (tag) => {
    if (!isObject(tag)) {
        return {name: tag};
    }
    return tag;
};

class TagSelectorController {
    tagList;
    constructor() {
        this.tags = [];
    }
    $onInit() {
        this.init();
    }
    init() {
        //make sure ngModel is an array before we try to modify it
        if (!isArray(this.ngModel)) {
            this.ngModel = [];
        }
        const tagList = this.tagList;
        //map to tag object if array of names
        this.tags = map(ifNotObject, tagList);
        this.selectedTags = angular.copy(this.ngModel);
    }
    addTag($tag) {
        this.ngModel = concat(this.ngModel, $tag.name);
    }
    removeTag($tag) {
        this.ngModel = pull($tag.name, this.ngModel);
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