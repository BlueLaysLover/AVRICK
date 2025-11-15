package main

import (
	"net/http"

	api "avrick.com/api"
	data "avrick.com/database"
	middleware "avrick.com/middlewre"
)

func main() {
    
	data.ConnectDB()
	data.InitFirebase()




	http.Handle("/api/signup" , middleware.Middleware(http.HandlerFunc(api.Signup)))


	http.Handle("/api/session/start" , middleware.Middleware(http.HandlerFunc(api.StartStudySession)))

	http.Handle("/api/session/end" , middleware.Middleware(http.HandlerFunc(api.EndStudySession)))

	http.Handle("/api/stats/daily" , middleware.Middleware(http.HandlerFunc(api.GetDailyStats)))

	// Serve static files from frontend/public directory
	fs := http.FileServer(http.Dir("frontend/public"))
	http.Handle("/", fs)

	http.ListenAndServe(":8000", nil)





}
//Hello this is my 1st PullGame