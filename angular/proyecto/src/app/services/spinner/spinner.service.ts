import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  constructor(private spinnerService: NgxSpinnerService
    ) { }

    public show(){
      this.spinnerService.show();
    }
    public hide(){
      this.spinnerService.hide();
    }
}
