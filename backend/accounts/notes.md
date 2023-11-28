## URLS
- `accounts/seeker/` ListCreateAPIView
    - POST: create a seeker profile [AllowAny]
- `accounts/seeker/<int:pk>` RetrieveUpdateDestroyAPIView
    - PUT: update the profile 
    - DELETE: delete the seeker's applications
    - GET: retreive the seeker's profile [IsAuthenticated] (handles if user signed in is a shelter)
- `accounts/shelter/` ListCreateAPIView
    - POST: create a shelter profile [AllowAny]
    - GET: list a view of shelters [AllowAny]
- `accounts/shelter/<int:pk>` RetrieveUpdateDestroyAPIView
    - PUT: update the profile
    - DELETE: delete the shelter's listings + **delete the account as well**
    - GET: show shelter's profile

## Model
- individual + shelter model has FK's to login model

AccountType
    - Seeker 
    - Shelter

AccountType
    - email
    - phone number
  
Seeker
    - fields1
    - fields2
    - AccountType.FK

Shelter
    - fields1
    - fields2

Listing
    - FK to shelter

FROM:
Seeker1
    - notif from shelter1

Shelter1
    - notif from seeker1

TO:
Seeker1
