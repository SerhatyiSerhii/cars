import { Component, EventEmitter, Output } from "@angular/core";
import { FormControl, FormGroup, Validators, FormBuilder, FormArray, AbstractControl } from "@angular/forms";
import { CarItem } from "src/models/car-item";
import { ICarOwnersService } from "src/services/i-car-owners.service";

@Component({
    selector: 'container',
    templateUrl: './container.component.html',
    styleUrls: ['./container.component.scss']
})

export class ContainerComponent {

    @Output() public back = new EventEmitter<boolean>();

    public cars: CarItem[];
    public ownerTemplate: any[] = [
        { key: 'Name', value: 'name' },
        { key: 'Last name', value: 'lastname' },
        { key: 'Middle name', value: 'middlename' },
        { key: 'Cars amount', value: 'carsamount' }
    ];
    public ownerGroup: FormGroup;
    public viewOwner: boolean = false;
    public editOwner: boolean = false;

    constructor(public iCarOwnersService: ICarOwnersService, private fb: FormBuilder) {
        this.newForm();
    }

    public onBack(): void {
        if (this.iCarOwnersService.addContact) {
            this.iCarOwnersService.addContact = !this.iCarOwnersService.addContact;
        }

        if (this.viewOwner) {
            this.viewOwner = !this.viewOwner;
            this.iCarOwnersService.selectedOwner = undefined;
        }

        if (this.editOwner) {
            this.editOwner = !this.editOwner;
            this.iCarOwnersService.selectedOwner = undefined;
        }

        this.back.emit(true);
    }

    public newForm(): void {
        this.ownerGroup = new FormGroup({
            name: new FormControl('', Validators.required),
            lastname: new FormControl('', Validators.required),
            middlename: new FormControl('', Validators.required),
            carsamount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
            cars: new FormArray([])
        });
    }

    public get alternateCars() {
        return this.ownerGroup.get('cars') as FormArray;
    }

    public createOwner(): void {

        this.iCarOwnersService.createOwner(
            this.ownerGroup.controls.name.value,
            this.ownerGroup.controls.lastname.value,
            this.ownerGroup.controls.middlename.value,
            this.ownerGroup.controls.carsamount.value
        ).subscribe((data: any) => {
            this.iCarOwnersService.owners.push(data);

            const newCarsArr = this.alternateCars.controls;

            for (let car of newCarsArr) {
                this.iCarOwnersService.createCar(
                    car.value.stateNumber,
                    car.value.producerName,
                    car.value.modelName,
                    car.value.productionYear,
                    data.id
                ).subscribe();
            }
        });

        this.onBack();
    }

    public newContact(): void {
        this.newForm();
    }

    public exemineOwner() {
        this.viewOwner = !this.viewOwner;

        this.iCarOwnersService.getCars().subscribe((data: any) => {
            this.cars = data.filter((car: any) => {
                return car.ownerId == this.iCarOwnersService.selectedOwner!.id
            });
        })
    }

    public addCar(): void {
        this.ownerGroup.controls.carsamount.setValue(this.alternateCars.controls.length + 1);

        this.alternateCars.push(this.fb.group({
            stateNumber: new FormControl('', Validators.required),
            producerName: new FormControl('', Validators.required),
            modelName: new FormControl('', Validators.required),
            productionYear: new FormControl(2000, Validators.required),
        }));
    }

    public removeCar(): void {

        this.ownerGroup.controls.carsamount.setValue(this.alternateCars.controls.length - 1);

        this.alternateCars.controls.pop();
        this.alternateCars.value.pop();

        this.alternateCars.updateValueAndValidity();
    }


    public checkStateNumber(index: number): void {

        this.iCarOwnersService.getCars().subscribe((data: any) => {

            const numbers = data.map((item: any) => {
                return item.stateNumber;
            });

            const formNumbers = this.alternateCars.controls;

            for (let i of numbers) {
                if (this.ownerGroup.get('cars')?.value[index].stateNumber == i) {
                    this.alternateCars.controls[index].get('stateNumber')?.setErrors({});
                }
            }

            for (let i = 0; i < formNumbers.length; i++) {
                for (let j = i + 1; j < formNumbers.length; j++) {
                    if (formNumbers[i].get('stateNumber')?.value == formNumbers[j].get('stateNumber')?.value) {
                        formNumbers[j].get('stateNumber')?.setErrors({});
                    }
                }
            }
        });
    }

    public editStateNumber(car: any): void {


        this.iCarOwnersService.getCars().subscribe((data: any) => {
            const ownerCars = data.filter((car: any) => {
                return car.ownerId == this.iCarOwnersService.selectedOwner!.id
            }).map((car: any) => {
                return car.stateNumber;
            });;

            const allNumbers = data.map((car: any) => {
                return car.stateNumber;
            });

            const registeredNumbers = [];

            for (let i = 0; i < allNumbers.length; i++) {
                if (!ownerCars.includes(allNumbers[i])) {
                    registeredNumbers.push(allNumbers[i]);
                } else {
                    continue;
                }
            }

            if (registeredNumbers.includes(car.value.stateNumber)) {
                car.get('stateNumber').setErrors({});
            }

            const formNumbers = this.alternateCars.controls;

            for (let i = 0; i < formNumbers.length; i++) {
                for (let j = i + 1; j < formNumbers.length; j++) {
                    if (formNumbers[i].get('stateNumber')?.value == formNumbers[j].get('stateNumber')?.value) {
                        car.get('stateNumber')?.setErrors({});
                    }
                }
            }
        })
    }


    public allowEdit(): void {
        this.editOwner = !this.editOwner;

        this.iCarOwnersService.getCars().subscribe((data: any) => {

            this.cars = data.filter((car: any) => {
                return car.ownerId == this.iCarOwnersService.selectedOwner!.id;
            });

            if (!(this.alternateCars.controls.length == this.cars.length)) {
                for (let i = 0; i < this.cars.length; i++) {
                    this.alternateCars.push(this.fb.group({
                        stateNumber: new FormControl('', Validators.required),
                        producerName: new FormControl('', Validators.required),
                        modelName: new FormControl('', Validators.required),
                        productionYear: new FormControl(2000, Validators.required),
                    }));
                }
            }

            if (this.alternateCars.controls.length > this.cars.length) {
                for (let i = this.alternateCars.controls.length; i > this.cars.length; i--) {
                    this.alternateCars.controls.pop();
                }
            }

            this.ownerGroup.controls.name.setValue(this.iCarOwnersService.selectedOwner!.name);
            this.ownerGroup.controls.lastname.setValue(this.iCarOwnersService.selectedOwner!.surName);
            this.ownerGroup.controls.middlename.setValue(this.iCarOwnersService.selectedOwner!.middleName);
            this.ownerGroup.controls.carsamount.setValue(this.cars.length);

            for (let i = 0; i < this.alternateCars.controls.length; i++) {
                this.alternateCars.controls[i].get('stateNumber')?.setValue(this.cars[i].stateNumber);
                this.alternateCars.controls[i].get('producerName')?.setValue(this.cars[i].producerName);
                this.alternateCars.controls[i].get('modelName')?.setValue(this.cars[i].modelName);
                this.alternateCars.controls[i].get('productionYear')?.setValue(this.cars[i].productionYear);
            }
        });
    }

    public cancelEdit() {
        this.ownerGroup.reset();
        this.editOwner = !this.editOwner;
    }

    public updateOwner(): void {

        this.iCarOwnersService.selectedOwner!.name = this.ownerGroup.value.name;
        this.iCarOwnersService.selectedOwner!.surName = this.ownerGroup.value.lastname;
        this.iCarOwnersService.selectedOwner!.middleName = this.ownerGroup.value.middlename;
        this.iCarOwnersService.selectedOwner!.carsAmount = this.cars.length;

        this.iCarOwnersService.editOwner(this.iCarOwnersService.selectedOwner!).subscribe(() => {

            this.iCarOwnersService.getOwners().subscribe((data: any) => {

                this.iCarOwnersService.owners = data;
            });

            for (let i = 0; i < this.cars.length; i++) {
                this.cars[i].stateNumber = this.alternateCars.value[i].stateNumber;
                this.cars[i].producerName = this.alternateCars.value[i].producerName;
                this.cars[i].modelName = this.alternateCars.value[i].modelName;
                this.cars[i].productionYear = this.alternateCars.value[i].productionYear;

                this.iCarOwnersService.editCar(this.cars[i]).subscribe();
            }
        });

        this.onBack();
    }

    public addCarEdit(): void {
        this.addCar();

        this.iCarOwnersService.createCar('', '', '', 2000, this.iCarOwnersService.selectedOwner!.id).subscribe((data: any) => {
            this.cars.push(data);
        });
    }

    public removeCarEdit(car: AbstractControl): void {
        const ownerCarsNumbers = this.cars.map((item: any) => {
            return item.stateNumber;
        });

        const carIndex = ownerCarsNumbers.indexOf(car.value.stateNumber);

        this.iCarOwnersService.deleteCar(this.cars[carIndex].id).subscribe();

        this.cars.splice(carIndex, 1);
        this.alternateCars.controls.splice(carIndex, 1);
        this.alternateCars.value.splice(carIndex, 1);
    }
}