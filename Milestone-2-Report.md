# Milestone 2 – Opportunity & Application Management

## Objective

The objective of this milestone was to implement opportunity creation, management, and application workflows.

## Features Implemented

* Opportunity Creation (Admin only)
* Opportunity Editing and Soft Deletion
* Opportunity Listing with Filters
* Volunteer Application System
* Application Status Management (Pending, Accepted, Rejected)
* Role-based API protection using JWT
* Frontend forms for creating and applying opportunities

## Technologies Used

* Angular
* Node.js & Express
* MongoDB
* JWT Authentication

## Outcome

This milestone enabled a complete workflow where admins can create opportunities and volunteers can apply, forming the core functionality of the system.








BACKEND


models/
  Opportunity.js
  Application.js

controllers/
  opportunityController.js
  applicationController.js

routes/
  opportunityRoutes.js
  applicationRoutes.js

middleware/
  roleMiddleware.js
  ownershipMiddleware.js


  FRONTEND


  admin/
  applications/
  reports/ (basic)

volunteer/
  opportunities/

user/
  schedule-pickup/