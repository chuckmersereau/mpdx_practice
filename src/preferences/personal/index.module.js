import component from './personal.component';
import locale from './locale/locale.component';
import monthlyGoal from './monthlyGoal/monthlyGoal.component';

export default angular.module('mpdx.preferences.personal', [
    component,
    locale,
    monthlyGoal
]).name;