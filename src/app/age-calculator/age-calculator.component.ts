// age-calculator.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-age-calculator',
  templateUrl: './age-calculator.component.html',
  styleUrls: ['./age-calculator.component.scss']
})
export class AgeCalculatorComponent implements OnInit {
  ageForm: FormGroup;
  age: { years: number, months: number, days: number };
  maxDays: number;

  constructor(private fb: FormBuilder) {
    this.ageForm = this.fb.group({
      day: ['', [Validators.required, Validators.min(1), Validators.max(31)]],
      month: ['', [Validators.required, Validators.min(1), Validators.max(12)]],
      year: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]]
    });
  }

  ngOnInit(): void {
    this.ageForm.get('year')?.valueChanges.subscribe(() => {
      this.validateLeapYear();
      this.setDaysValidators();
    });

    this.ageForm.get('month')?.valueChanges.subscribe(() => {
      this.setDaysValidators();
    });
  }


  calculateAge(): void {
    const day: number = parseInt(this.ageForm.value.day, 10);
    const month: number = parseInt(this.ageForm.value.month, 10);
    const year: number = parseInt(this.ageForm.value.year, 10);

    const today: Date = new Date();
    const birthDate: Date = new Date(year, month - 1, day);

    if (isNaN(birthDate.getTime())) {
      // Handle invalid date
      this.age = { years: 0, months: 0, days: 0 };
      return;
    }

    let years: number = today.getFullYear() - birthDate.getFullYear();
    const monthDiff: number = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      years--;
    }

    birthDate.setFullYear(birthDate.getFullYear() + years);
    const diffMonths: number = today.getMonth() - birthDate.getMonth();
    const diffDays: number = today.getDate() - birthDate.getDate();

    let months = diffMonths >= 0 ? diffMonths : 12 + diffMonths;
    let days = diffDays >= 0 ? diffDays : this.daysInMonth(today.getMonth() - 1, today.getFullYear()) + diffDays;

    this.age = { years, months, days };
  }

  validateLeapYear(): void {
    const year = this.ageForm.get('year')?.value;
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
      this.maxDays = 29; // Leap year, February has 29 days
    } else {
      this.maxDays = 28; // Not a leap year, February has 28 days
    }
  }

  setDaysValidators(): void {
    const selectedMonth = this.ageForm.get('month')?.value;
    const year = this.ageForm.get('year')?.value;
    if (selectedMonth === 2) {
      this.validateLeapYear();
    } else {
      this.maxDays = this.daysInMonth(selectedMonth - 1, year);
    }
    const dayControl = this.ageForm.get('day');
    dayControl?.setValidators([Validators.required, Validators.min(1), Validators.max(this.maxDays)]);
    dayControl?.updateValueAndValidity();
  }

  daysInMonth(month: number, year: number): number {
    return new Date(year, month + 1, 0).getDate();
  }
}
