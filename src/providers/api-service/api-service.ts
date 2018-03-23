import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
//import { HttpModule } from '@angular/http';
import 'rxjs/add/operator/map';
import {Headers} from '@angular/http';


/*
  Generated class for the ApiServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ApiServiceProvider {

	data: any;

	constructor(public http: Http) {
		console.log('Hello ApiServiceProvider Provider');
	    this.data = null;
	}
	// Toca agregar otra funcion para post
	get(url,options=0,str="") {
	  	/*if (this.data) {
	    // already loaded data
	    	return Promise.resolve(this.data);

	  	}*/

		  // don't have the data yet
		return new Promise(resolve => {
		    // We're using Angular HTTP provider to request the data,
		    // then on the response, it'll map the JSON data to a parsed JS object.
		    // Next, we process the data and resolve the promise with the new data.

		    if(options){
		    	let header = new Headers({ 'Authorization': str });
		    	//let options = new RequestOptions({ headers: headers }); 
			    this.http.get(url, {headers: header})
			      .map(res => res.json())
			      .subscribe(data => {
			        // we've got back the raw data, now generate the core schedule data
			        // and save the data for later reference
			        this.data = data;
			        resolve(this.data);
			      });
		  	}
		  	else{
		  		this.http.get(url)
			      .map(res => res.json())
			      .subscribe(data => {
			        // we've got back the raw data, now generate the core schedule data
			        // and save the data for later reference
			        this.data = data;
			        resolve(this.data);
			      });
		  	}
		});
	}

	post(url,body){
		/*if (this.data) {
	    // already loaded data
	    	return Promise.resolve(this.data);
	  	}*/

		  // don't have the data yet
		return new Promise(resolve => {
		    // We're using Angular HTTP provider to request the data,
		    // then on the response, it'll map the JSON data to a parsed JS object.
		    // Next, we process the data and resolve the promise with the new data.
		    let header = new Headers({ 'Content-Type': "application/json" });
		  	this.http.post(url,body,{headers: header})
			    .map(res => res.json())
			    .subscribe(data => {
			    // we've got back the raw data, now generate the core schedule data
			    // and save the data for later reference
			    this.data = data;
			    resolve(this.data);
			});
		});
	}

}
