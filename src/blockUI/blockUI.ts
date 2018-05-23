interface IBlockUIService extends ng.blockUI.BlockUIService {
    instances: IBUIInstances;
}

interface IBUIInstances {
    get(instance: string): IBlockUIService;
}