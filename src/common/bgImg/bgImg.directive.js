function bgImgDirective() {
    return function(scope, element, attrs) {
        attrs.$observe('bgImg', (value) => {
            element.css({
                'background-image': 'url(' + value + ')'
            });
        });
    };
}

export default angular.module('mpdx.common.bgImg.directive', [])
    .directive('bgImg', bgImgDirective).name;