import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'kt-banks',
  templateUrl: './banks.component.html',
  styleUrls: ['./banks.component.scss']
})
export class BanksComponent implements OnInit {

	// define the JSON of books data
    public booksData: string[] = [
		'Support Vector Machines Succinctly',
		'Scala Succinctly',
		'Application Security in .NET Succinctly',
		'ASP.NET WebHooks Succinctly',
		'Xamarin.Forms Succinctly',
		'Asynchronous Programming Succinctly',
		'Java Succinctly Part 2',
		'Java Succinctly Part 1',
		'PHP Succinctly',
		'Bing Maps V8 Succinctly',
		'WPF Debugging and Performance Succinctly',
		'Go Web Development Succinctly',
		'Go Succinctly',
		'More UWP Succinctly',
		'UWP Succinctly',
		'LINQPad Succinctly',
		'MongoDB 3 Succinctly',
		'R Programming Succinctly',
		'Azure Cosmos DB and DocumentDB Succinctly',
		'Unity Game Development Succinctly',
		'Aurelia Succinctly',
		'Microsoft Bot Framework Succinctly',
		'ASP.NET Core Succinctly',
		'Twilio with C# Succinctly',
		'Angular 2 Succinctly',
		'Camtasia Succinctly',
		'Keystone.js Succinctly',
		'SQL Server for C# Developers Succinctly',
		'Ubuntu Server Succinctly',
		'Statistics Fundamentals Succinctly',
		'SOLID Principles Succinctly',
		'Customer Success for C# Developers Succinctly',
		'Data Capture and Extraction with C# Succinctly',
		'Hadoop Succinctly',
		'Hive Succinctly',
		'ECMAScript 6 Succinctly',
		'Gulp Succinctly',
		'Object-Oriented Programming in C# Succinctly',
		'C# Code Contracts Succinctly',
		'Leaflet.js Succinctly',
		'SQL on Azure Succinctly'
    ];

	bankName = new FormControl();
	filteredOptions: Observable<string[]>;

	constructor() {}

	ngOnInit() {
		this.filteredOptions = this.bankName.valueChanges
		.pipe(
			startWith(''),
			debounceTime(200),
			distinctUntilChanged(),
			map(value => this._filter(value))
		);
	}

	private _filter(value: string): string[] {
		const filterValue = value.toLowerCase();

		return this.booksData.filter(option => option.toLowerCase().includes(filterValue));
	}

}
