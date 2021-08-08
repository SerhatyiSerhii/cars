export class CarItem {
    private static idGenerator: number = 4;

    public readonly id: number;

    constructor(
        public stateNumber: string,
        public producerName: string,
        public modelName: string,
        public productionYear: number,
        public ownerId: number
    ) {
        this.id = CarItem.idGenerator++
    }
}