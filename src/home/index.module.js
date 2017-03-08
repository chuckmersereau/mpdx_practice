import care from './care/index.module';
import commitments from './commitments/commitments.component';
import component from './home.component';
import connect from './connect/connect.component';
import donationChart from './donationsSummaryChart/donationsSummaryChart.directive';
import progress from './progress/index.module';
import welcome from './welcome/welcome.component';

export default angular.module('mpdx.home', [
    care,
    commitments,
    component,
    connect,
    donationChart,
    progress,
    welcome
]).name;
