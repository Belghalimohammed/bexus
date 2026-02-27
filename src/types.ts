
export type WidgetType = 'terminal' | 'resource' | 'subdomain' | 'uptime';

export interface WidgetInstance {
  id: string;
  type: WidgetType;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface WidgetDefinition {
  type: WidgetType;
  label: string;
  icon: string;
  defaultW: number;
  defaultH: number;
}

export interface Page {
  id: string;
  name: string;
  widgets: WidgetInstance[];
}
