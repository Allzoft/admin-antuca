import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Customer } from '@interfaces/customer';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  providers: [DialogService],
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

  public ref: DynamicDialogRef | undefined;




}
