import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from 'src/services/in-memory-data.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ContainerComponent } from './container-component/container.component';

@NgModule({
  declarations: [
    AppComponent,
    ContainerComponent
  ],
  imports: [
    BrowserModule,
    InMemoryWebApiModule.forRoot(InMemoryDataService),
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
