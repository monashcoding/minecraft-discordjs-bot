export interface PterodactylResourceUsage {
  memory_bytes: number;
  cpu_absolute: number;
  disk_bytes: number;
  network_rx_bytes: number;
  network_tx_bytes: number;
  uptime: number;
}

export interface PterodactylServerAttributes {
  current_state: "running" | "starting" | "stopping" | "offline";
  is_suspended: boolean;
  resources: PterodactylResourceUsage;
}

export interface PterodactylResponse {
  object: "stats";
  attributes: PterodactylServerAttributes;
}
