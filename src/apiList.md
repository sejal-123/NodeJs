# Dev Tinder APIs

authRouter
- POST /signup
- POST login
- POST logout

profileRouter
- GET /profile/view
- PATCH profile/edit
- PATCH profile/password

connectionRequestRouter
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

userRouter
- GET /user/connections
- GET /user/feed - gets you the profile of the other users on platform
- GET /user/requests

Status: ignore, interested, accepted, rejected



