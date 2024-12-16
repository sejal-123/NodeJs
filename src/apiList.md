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
- POST /request/send/:status/:userId
- POST /request/review/:status/:requestId

userRouter
- GET /user/connections
- GET /user/feed - gets you the profile of the other users on platform
- GET /user/requests

Status: ignore, interested, accepted, rejected



