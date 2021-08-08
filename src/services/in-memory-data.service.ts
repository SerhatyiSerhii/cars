import { InMemoryDbService } from "angular-in-memory-web-api";
import { CarItem } from "src/models/car-item";
import { OwnerItem } from "src/models/owner-item";

export class InMemoryDataService implements InMemoryDbService {
    createDb() {
        const owners: OwnerItem[] = [
            {
                id: 0,
                name: 'Иван',
                surName: 'Иванов',
                middleName: 'Иванович',
                carsAmount: 1
            },
            {
                id: 1,
                name: 'Петр',
                surName: 'Петров',
                middleName: 'Петрович',
                carsAmount: 1
            },
            {
                id: 2,
                name: 'Степан',
                surName: 'Степанов',
                middleName: 'Степанович',
                carsAmount: 2
            }
        ];

        const cars: CarItem[] = [
            {
                id: 0,
                stateNumber: 'AA0001AA',
                producerName: 'Lada',
                modelName: 'Priora',
                productionYear: 2018,
                ownerId: 0
            },
            {
                id: 1,
                stateNumber: 'AA0002AA',
                producerName: 'Lada',
                modelName: 'Priora',
                productionYear: 2017,
                ownerId: 1
            },
            {
                id: 2,
                stateNumber: 'AA0003AA',
                producerName: 'Lada',
                modelName: 'Priora',
                productionYear: 2019,
                ownerId: 2
            },
            {
                id: 3,
                stateNumber: 'AA0004AA',
                producerName: 'ZaZ',
                modelName: 'Tavria',
                productionYear: 2015,
                ownerId: 2
            }
        ]

        return {
            owners,
            cars
        }
    }
}