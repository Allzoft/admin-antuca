import { MenuItem } from "./customer";

export interface Role {
  id_role: number;
  name: string;
  access: MenuItem[];
  id_access?: number[];
}
