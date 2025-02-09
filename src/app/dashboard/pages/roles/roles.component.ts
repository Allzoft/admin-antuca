import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Role } from '@interfaces/role';
import { LayoutService } from '@services/layout.service';
import { RoleService } from '@services/roles.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
    selector: 'app-roles',
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        ToastModule,
        ConfirmDialogModule,
        CheckboxModule,
        SkeletonModule,
        InputIconModule,
        IconFieldModule
    ],
    providers: [ConfirmationService, MessageService],
    templateUrl: './roles.component.html'
})
export default class RolesComponent {
  private confirmationService = inject(ConfirmationService);
  public rolesService = inject(RoleService);
  public layoutServices = inject(LayoutService);
  public messageService = inject(MessageService);
  public roles = this.rolesService.roles;
  public filteredRoles = [...this.rolesService.roles()];

  public accesses = this.rolesService.accesses;

  public loadingRoles = this.rolesService.loading;
  public loadingAccesses = this.rolesService.loadingAccesses;

  public selectedRole: Role = {
    id_role: 0,
    name: '',
    access: [],
  };

  public inputsDirt = {
    name: false,
  };

  constructor() {
    this.rolesService.getRolesWithAccess();
    this.rolesService.getAccesses();
  }

  public refreshData(): void {
    this.rolesService.getRolesWithAccess();
    this.rolesService.getAccesses();
  }

  public createRole() {
    this.accesses().forEach((a) => (a.isSelect = false));
    this.selectedRole = {
      id_role: 0,
      name: '',
      access: [],
    };
  }

  public editRole(role: Role) {
    this.accesses().forEach((a) => (a.isSelect = false));
    this.selectedRole = role;
    this.selectedRole.access.forEach((access) => {
      this.accesses().forEach((accessItem) => {
        if (access.id_access === accessItem.id_access) {
          accessItem.isSelect = true;
        }
      });
    });
  }

  public deleteRole(role: Role) {
    this.confirmationService.confirm({
      message: 'Esta seguro de eliminar el rol ' + role.name,
      acceptLabel: 'Si',
      acceptButtonStyleClass: 'p-button-rounded p-button-success w-7rem',
      rejectLabel: 'No',
      rejectButtonStyleClass: 'p-button-rounded p-button-danger w-7rem',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.rolesService.deleteRole(role.id_role).subscribe((_) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Eliminación exitosa',
            detail: `${role.name} eliminado exitosamente`,
          });
        });
      },
    });
  }

  public async saveRole() {
    if (!(await this.passRoleForm())) return;

    const accesses: number[] = [];
    this.accesses().forEach((a) => {
      if (a.isSelect) accesses.push(a.id_access);
    });

    const newRole: Partial<Role> = {
      name: this.selectedRole.name,
      id_access: accesses,
    };

    if (this.selectedRole.id_role === 0) {
      this.rolesService.postRole(newRole).subscribe((resRole) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Creación exitosa',
          detail: `El rol ${resRole.name} se creo exitosamente`,
        });
        this.accesses().forEach((a) => (a.isSelect = false));
        this.selectedRole = {
          id_role: 0,
          name: '',
          access: [],
        };
      });
    } else {
      this.rolesService
        .updateRole(this.selectedRole.id_role, newRole)
        .subscribe((resRole) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Creación exitosa',
            detail: `El rol ${resRole.name} se actualizo exitosamente`,
          });
          this.accesses().forEach((a) => (a.isSelect = false));
          this.selectedRole = {
            id_role: 0,
            name: '',
            access: [],
          };
        });
    }
  }

  public passRoleForm(): Promise<boolean> {
    if (!this.selectedRole.name) {
      this.inputsDirt.name = true;
      return Promise.resolve(false);
    }
    return Promise.resolve(true);
  }
}
