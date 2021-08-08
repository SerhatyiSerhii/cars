export class OwnerItem {
    private static idGenerator: number = 3;

    public readonly id: number;

    constructor(
        public name: string,
        public surName: string,
        public middleName: string,
        public carsAmount: number
    ) {
        this.id = OwnerItem.idGenerator++;
    }
}