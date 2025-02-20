import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { State } from '@interfaces/state';
import { StatesService } from '@services/states.service';
import { TitleComponent } from '@shared/title/title.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { SidebarModule } from 'primeng/sidebar';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { LayoutService } from '@services/layout.service';
import { DrawerModule } from 'primeng/drawer';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-states',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    DrawerModule,
    DropdownModule,
    ToastModule,
    ConfirmDialogModule,
    InputIconModule,
    IconFieldModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './states.component.html',
})
export default class StatesComponent {
  private confirmationService = inject(ConfirmationService);
  public layoutService = inject(LayoutService);
  public statesService = inject(StatesService);
  public messageService = inject(MessageService);
  public states = this.statesService.states;
  public filteredStates = [...this.statesService.states()];
  public selectedState: State = {
    id_state: 0,
    name: '',
    priority: 0,
    type: '',
  };

  public inputsDirt = {
    name: false,
    color: false,
    priority: false,
    type: false,
  };

  public stateOptions: string[] = ['Order'];

  public showState: boolean = false;

  public refreshData(): void {
    this.statesService.getAllStates();
  }

  public createState() {
    this.selectedState = {
      id_state: 0,
      name: '',
      priority: 0,
      type: '',
    };
    this.showState = true;
  }

  public editState(state: State) {
    this.selectedState = state;
    this.showState = true;
  }

  public deleteState(state: State) {
    this.confirmationService.confirm({
      message: 'Esta seguro de eliminar el estdo' + state.name,
      acceptLabel: 'Si',
      acceptButtonStyleClass: 'p-button-rounded p-button-success w-28',
      rejectLabel: 'No',
      rejectButtonStyleClass: 'p-button-rounded p-button-warning w-28',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.statesService.deleteStates(state.id_state).subscribe((_) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Eliminación exitosa',
            detail: `${state.name} eliminado exitosamente`,
          });
        });
      },
    });
  }

  public async saveState() {
    if (!(await this.passStateForm())) return;

    const newState: Partial<State> = {
      name: this.selectedState.name,
      priority: this.selectedState.priority,
      type: this.selectedState.type,
    };
    if (this.selectedState.id_state === 0) {
      this.statesService.postStates(newState).subscribe((resState) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Creación exitosa',
          detail: `El estado ${resState.name} se creo exitosamente`,
        });
        this.showState = false;
      });
    } else {
      this.statesService
        .updateState(this.selectedState.id_state, newState)
        .subscribe((resState) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Creación exitosa',
            detail: `El estado ${resState.name} se actualizo exitosamente`,
          });
          this.showState = false;
        });
    }
  }

  public passStateForm(): Promise<boolean> {
    if (!this.selectedState.name) {
      this.inputsDirt.name = true;
      return Promise.resolve(false);
    }
    if (!this.selectedState.type) {
      this.inputsDirt.type = true;
      return Promise.resolve(false);
    }
    return Promise.resolve(true);
  }
}
