export interface BlockedDomainResponse {
  id: number;
  pattern: string;
  reason: string;
  createdAt: string;
}

export interface BlockedDomainRequest {
  pattern: string;
  reason: string;
}
