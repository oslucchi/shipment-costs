import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { CurrentStockComponent } from './components/current-stock/current-stock.component';
import { ShipmentCostsComponent } from './components/shipment-costs/shipment-costs.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'current-stock', component: CurrentStockComponent },
  { path: 'shipment-costs', component: ShipmentCostsComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }