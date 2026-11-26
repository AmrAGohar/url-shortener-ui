import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlockedDomainService } from '../../services/blocked-domain.service';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  form: FormGroup;
  showForm = signal(false);
  activeTab = signal<'dashboard' | 'blocked'>('dashboard');

  constructor(
    public domainService: BlockedDomainService,
    public dashboardService: DashboardService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      pattern: ['', [Validators.required, Validators.minLength(2)]],
      reason: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {
    this.dashboardService.loadDashboard();
    this.domainService.loadDomains();
  }

  toggleForm(): void {
    this.showForm.update((v) => !v);
    if (!this.showForm()) {
      this.form.reset();
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.domainService.addDomain(this.form.value);
    this.form.reset();
    this.showForm.set(false);
  }

  onDelete(id: number): void {
    this.domainService.deleteDomain(id);
  }
}
