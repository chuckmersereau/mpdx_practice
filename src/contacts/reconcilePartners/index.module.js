import item from './item/item.component';
import reconcilePartners from './reconcilePartners.component';
import service from './reconciler.service';

export default angular.module('mpdx.contacts.reconcilePartners', [
    item,
    reconcilePartners,
    service
]).name;