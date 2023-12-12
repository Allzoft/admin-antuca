import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Customer } from '@interfaces/customer';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html',
})
export default class UserComponent {
  @Input() user: Customer = {
    id_customer: 0,
    name: '',
    lastname: '',
    email: '',
    code_country: '',
    id: '',
    phone: '',
    photo: '',
    token: '',
  };



}
