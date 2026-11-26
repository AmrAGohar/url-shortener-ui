import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthRequest, AuthResponse } from '../models/auth.model';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = 'http://localhost:8080/api/v1/auth';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  currentUser = signal<AuthResponse | null>(this.loadStoredUser());
  loading = signal(false);
  error = signal<string | null>(null);

  isLoggedIn = computed(() => this.currentUser() !== null);
  isAdmin = computed(() => this.currentUser()?.role === 'ADMIN');
  username = computed(() => this.currentUser()?.username ?? null);

  constructor(private http: HttpClient, private router: Router) {}

  async login(request: AuthRequest): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    const hashedPassword = await this.hashPassword(request.password);
    this.http.post<AuthResponse>(`${this.apiUrl}/login`, {
      username: request.username,
      password: hashedPassword,
    }).subscribe({
      next: (response) => {
        this.storeUser(response);
        this.currentUser.set(response);
        this.loading.set(false);
        this.router.navigate([response.role === 'ADMIN' ? '/admin' : '/urls']);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Invalid credentials');
        this.loading.set(false);
      },
    });
  }

  async register(request: AuthRequest): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    const hashedPassword = await this.hashPassword(request.password);
    this.http.post<AuthResponse>(`${this.apiUrl}/register`, {
      username: request.username,
      password: hashedPassword,
    }).subscribe({
      next: (response) => {
        this.storeUser(response);
        this.currentUser.set(response);
        this.loading.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Registration failed');
        this.loading.set(false);
      },
    });
  }

  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    try {
      return localStorage.getItem(this.TOKEN_KEY);
    } catch {
      return null;
    }
  }

  private storeUser(response: AuthResponse): void {
    try {
      localStorage.setItem(this.TOKEN_KEY, response.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(response));
    } catch {}
  }

  private loadStoredUser(): AuthResponse | null {
    try {
      const stored = localStorage.getItem(this.USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }
}
