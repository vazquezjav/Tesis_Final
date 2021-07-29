import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DjangoService {

  URL="https://cloudcomputing.ups.edu.ec/api-django-siast";
  constructor(private http: HttpClient) { }

  analizar_post(data:any){
    console.log("llega")
    return this.http.post(`${this.URL}/facebook/`,data)
  }
}
