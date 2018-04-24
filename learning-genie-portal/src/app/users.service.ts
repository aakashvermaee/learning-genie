import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
const url = 'https://warm-savannah-20783.herokuapp.com/';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'x-auth':  localStorage.getItem('id_token')
  })
};
@Injectable()
export class UsersService {
  constructor(private http: HttpClient) { }
  getUsers(): Observable<any> {
    return this.http.get(url + 'users', httpOptions).map( resp => resp);
  }
}
