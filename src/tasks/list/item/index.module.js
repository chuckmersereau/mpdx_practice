import comment from './comment/comment.component';
import component from './item.component';

export default angular.module('mpdx.tasks.list.item', [
    comment,
    component
]).name;