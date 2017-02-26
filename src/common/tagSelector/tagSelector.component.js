import clone from 'lodash/fp/clone';
import isObject from 'lodash/fp/isObject';
import map from 'lodash/fp/map';

class TagSelectorController {
    tagList;
    constructor() {
        this.tags = [];
    }
    $onInit() {
        this.init();
    }
    init() {
        const ifNotObject = (tag) => {
            if (!isObject(tag)) {
                return {name: tag};
            }
            return tag;
        };
        const tagList = this.tagList;
        this.tags = map(ifNotObject, tagList);
        this.selectedTags = clone(this.ngModel);
    }
    addTag($tag) {
        this.ngModel.push($tag.name);
    }
    removeTag($tag) {
        const index = this.ngModel.indexOf($tag.name);
        if (index > -1) {
            this.ngModel.splice(index, 1);
        }
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