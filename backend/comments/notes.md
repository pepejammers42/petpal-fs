# Comments
## URLS
- `/comments/shelters/<int:shelter_id>/all/` ListAPIView
    - GET: See comments for a shelter [IsAuthenticated]
- `/comments/shelters/<int:shelter_id>/` CreateAPIView
    - POST: Create a comment for a shelter [IsAuthenticated]
- `/comments/applications/<int:application_id>/all/` ListAPIView
    - GET: See comments for an application [IsApplicationRelated]
- `/comments/applications/<int:application_id>/` CreateAPIView
    - POST: Create a comment for an application [IsApplicationRelated]
