import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { EmailService } from 'src/app/services/email.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  @Output() navbarEvent = new EventEmitter();
  
  folders = [
    { name: 'All Folders', value: 'All'},
    { name: 'Inbox', value: 'Inbox'},
    { name: 'Sent', value: 'Sent'},
    { name: 'Drafts', value: 'Draft'},
    { name: 'Trash', value: 'Trash'}
  ];

  form = new FormGroup(
    {
      keywords: new FormControl(''),
      from: new FormControl(''),
      to: new FormControl(''),
      subject: new FormControl(''),
      fromDate: new FormControl(''),
      toDate: new FormControl(''),
      folders: new FormControl(this.folders[0]),
    },
    this.notEmptyFormValidator()
  );

  constructor(private router: Router, private userService: UserService) {}

  logout() {
    this.userService.logout().subscribe(() => {
      localStorage.clear();
      this.router.navigate(['/login']);
    });
  }

  search() {
    const formValues = this.getFormFields();

    const formatDate = (date: Date) => 
      {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
    
        return `${year}-${month}-${day}`;
      };

    if (formValues['startDate']) formValues['startDate'] = formatDate(formValues['startDate']);
    if (formValues['endDate']) formValues['endDate'] = formatDate(formValues['endDate']);

    this.router.navigate(['/mail/search'], { queryParams: formValues });
  }

  reset() {
    this.form.reset();
  }

  toggleNavbar() {
    this.navbarEvent.emit();
  }

  private getFormFields() {
    const { keywords, from, to, subject, fromDate, toDate, folders } = this.form.value;
    let formValues: { [key: string]: any } = { keywords, from, to, subject, startDate: fromDate, endDate: toDate, folders: folders!.value };
    for (const [key, value] of Object.entries(formValues)) {
      if (!value) delete formValues[key];
    }
    return formValues;
  }

  private notEmptyFormValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const { keywords, from, to, subject, fromDate, toDate } = formGroup.value;
      const formValues: { [key: string]: any } = { keywords, from, to, subject, startDate: fromDate, endDate: toDate};
      return Object.values(formValues).some(value => value) ? null : { emptyForm: true };
    };
  }
}
