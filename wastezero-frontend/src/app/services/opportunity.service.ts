import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OpportunityService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  // Create Opportunity (Admin)
  createOpportunity(data: any) {
    return this.http.post(`${this.apiUrl}/opportunities`, data, this.getHeaders());
  }

  // Get open Opportunities (Volunteer view)
  getOpportunities() {
    return this.http.get(`${this.apiUrl}/opportunities`, this.getHeaders());
  }

  // Get ALL Opportunities (Admin view)
  getAllOpportunities() {
    return this.http.get(`${this.apiUrl}/opportunities/all`, this.getHeaders());
  }

  // Get MATCHED Opportunities (Volunteer — based on skills + location)
  getMatchedOpportunities() {
    return this.http.get(`${this.apiUrl}/opportunities/matched`, this.getHeaders());
  }

  // Update Opportunity (Admin)
  updateOpportunity(id: string, data: any) {
    return this.http.put(`${this.apiUrl}/opportunities/${id}`, data, this.getHeaders());
  }

  // Delete Opportunity (Admin)
  deleteOpportunity(id: string) {
    return this.http.delete(`${this.apiUrl}/opportunities/${id}`, this.getHeaders());
  }

  // Apply to Opportunity (Volunteer)
  applyOpportunity(opportunity_id: string) {
    return this.http.post(
      `${this.apiUrl}/applications/apply`,
      { opportunity_id },
      this.getHeaders()
    );
  }

  // Get All Applications (Admin)
  getApplications() {
    return this.http.get(`${this.apiUrl}/applications`, this.getHeaders());
  }

  // Accept / Reject Application (Admin)
  updateApplicationStatus(id: string, status: string) {
    return this.http.put(
      `${this.apiUrl}/applications/${id}`,
      { status },
      this.getHeaders()
    );
  }

  // Get My Applications (Volunteer)
  getMyApplications() {
    return this.http.get(`${this.apiUrl}/applications/my`, this.getHeaders());
  }
}