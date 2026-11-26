import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BlockedDomainRequest, BlockedDomainResponse } from '../models/blocked-domain.model';

@Injectable({ providedIn: 'root' })
export class BlockedDomainService {
  private readonly apiUrl = 'http://localhost:8080/api/v1/admin/blocked-domains';

  domains = signal<BlockedDomainResponse[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  loadDomains(): void {
    this.loading.set(true);
    this.error.set(null);
    this.http.get<BlockedDomainResponse[]>(this.apiUrl).subscribe({
      next: (domains) => {
        this.domains.set(domains);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to load blocked domains');
        this.loading.set(false);
      },
    });
  }

  addDomain(request: BlockedDomainRequest): void {
    this.loading.set(true);
    this.error.set(null);
    this.http.post<BlockedDomainResponse>(this.apiUrl, request).subscribe({
      next: (domain) => {
        this.domains.update((list) => [domain, ...list]);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to add blocked domain');
        this.loading.set(false);
      },
    });
  }

  deleteDomain(id: number): void {
    this.loading.set(true);
    this.error.set(null);
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.domains.update((list) => list.filter((d) => d.id !== id));
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to delete blocked domain');
        this.loading.set(false);
      },
    });
  }
}
