import { Component, OnInit } from '@angular/core';
import { OwnerItem } from 'src/models/owner-item';
import { ICarOwnersService } from 'src/services/i-car-owners.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public mainView: boolean = true;

  constructor(public iCarOwnersService: ICarOwnersService) { }

  ngOnInit() {

    this.iCarOwnersService.getOwners().subscribe((data: any) => {

      this.iCarOwnersService.owners = data;

    });
  }

  public changeView(event: boolean) {
    this.mainView = event;
  }

  public addContact(): void {
    this.iCarOwnersService.addContact = !this.iCarOwnersService.addContact;
  }

  public selectOwner(owner: OwnerItem): void {
    this.iCarOwnersService.selectedOwner = owner;
  }

  public deleteOwner(): void {

    this.iCarOwnersService.getCars().subscribe((data: any) => {
      const carsOfOwner = data.filter((car: any) => {
        return car.ownerId == this.iCarOwnersService.selectedOwner!.id;
      });

      for (let i of carsOfOwner) {
        this.iCarOwnersService.deleteCar(i.id).subscribe();
      }

      this.iCarOwnersService.deleteOwner(this.iCarOwnersService.selectedOwner!.id).subscribe();

      this.iCarOwnersService.getOwners().subscribe((data: any) => {
        this.iCarOwnersService.owners = data;

        this.iCarOwnersService.selectedOwner = undefined;
      });
    })
  }
}
