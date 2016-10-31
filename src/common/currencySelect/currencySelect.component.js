class CurrencySelectController {
    constructor(
        twitterCldr
    ) {
        this.currencies = _.values(twitterCldr.Currencies.currencies);
    }
    $onInit() {
        var ngModel = this.ngModel;
        ngModel.$render = this.onChange;
    }
    onChange() {
        this.selectedCurrency = this.ngModel.$viewValue;
    }
    currencySelected() {
        this.ngModel.$setViewValue(this.selectedCurrency);
    }
}

const CurrencySelect = {
    template: require('./currencySelect.html'),
    controller: CurrencySelectController,
    require: {
        ngModel: 'ngModel'
    }
};

export default angular.module('mpdx.common.currencySelect.component', [])
        .component('currencySelect', CurrencySelect).name;
