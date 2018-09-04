import 'angular-block-ui';
import { reduce, toInteger } from 'lodash/fp';
import designationAccounts, { DesignationAccountsService } from '../../common/designationAccounts/designationAccounts.service';


class CoachController {
  property: string = '';

  constructor (){

  }

  $onInit(): void {
  }

}


const Coach = {
  controller = CoachController,
  template = './coach.html'
};

export default angular.module('mpdx.reports.coach.component',[
  'blockUI',
  designationAccounts
])
  .component('coach', Coach).name;
