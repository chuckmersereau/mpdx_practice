import care from './care/care.component';
import commitments from './commitments/commitments.component';
import component from './home.component';
import connect from './connect/connect.component';
import progress from './progress/index.module';
import welcomeHeader from './welcomeHeader/welcomeHeader.component';

export default angular.module('mpdx.home', [
    care,
    commitments,
    component,
    connect,
    progress,
    welcomeHeader
]).name;