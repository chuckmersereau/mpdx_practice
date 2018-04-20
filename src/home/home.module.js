import care from './care/care.module';
import commitments from './commitments/commitments.component';
import component from './home.component';
import connect from './connect/connect.component';
import progress from './progress/progress.module';
import welcome from './welcome/welcome.component';

export default angular.module('mpdx.home', [
    care,
    commitments,
    component,
    connect,
    progress,
    welcome
]).name;
