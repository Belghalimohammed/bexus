
export type WidgetType = 
  | 'docker' | 'vm' | 'lb' | 's3' 
  | 'gauge' | 'sparkline' | 'processes' | 'uptime_sla'
  | 'terminal' | 'script' | 'sql'
  | 'tunnels' | 'waf' | 'ssl'
  | 'git' | 'pipeline' | 'webhook'
  | 'sticky' | 'clock' | 'iframe';

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
