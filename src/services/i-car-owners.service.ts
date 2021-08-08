import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { OwnerItem } from "src/models/owner-item";
import { CarItem } from "src/models/car-item";

@Injectable({
    providedIn: 'root'
})
export class ICarOwnersService {
    public addContact: boolean = false;
    public selectedOwner: OwnerItem | undefined;
    public owners: OwnerItem[];

    constructor(private http: HttpClient) { }

    public getOwners(): Observable<OwnerItem[]> {
        return this.http.get<OwnerItem[]>('/api/owners');
    }

    public getOwnerById(id: number): Observable<OwnerItem> {
        return this.http.get<OwnerItem>(`/api/owners/${id}`);
    }

    public createOwner(name: string, surName: string, middleName: string, carsAmount: number): Observable<OwnerItem> {
        const newOwner = new OwnerItem(name, surName, middleName, carsAmount);

        return this.http.post<OwnerItem>('/api/owners', newOwner);
    }

    public editOwner(owner: OwnerItem): Observable<OwnerItem> {
        return this.http.put<OwnerItem>(`/api/owners/${owner.id}`, owner);
    }

    public deleteOwner(id: number): Observable<OwnerItem[]> {
        return this.http.delete<OwnerItem[]>(`/api/owners/${id}`);
    }

    public getCars():  Observable<CarItem[]> {
        return this.http.get<CarItem[]>('/api/cars');
    }

    public createCar(stateNumber: string, producerName: string, modelName: string, productionYear: number, ownerId: number): Observable<CarItem> {
        const newCar = new CarItem(stateNumber, producerName, modelName, productionYear, ownerId);

        return this.http.post<CarItem>('/api/cars', newCar);
    }

    public editCar(car: CarItem): Observable<CarItem> {
        return this.http.put<CarItem>(`/api/cars/${car.id}`, car);
    }

    public deleteCar(id: number): Observable<CarItem[]> {
        return this.http.delete<CarItem[]>(`/api/cars/${id}`);
    }
}