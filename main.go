package main

import (
	"net/http"

	api "avrick.com/api/auth"
	data "avrick.com/database"
	middleware "avrick.com/middlewre"
)

func main() {
    
	data.ConnectDB()
	data.InitFirebase()




	http.Handle("/api/signup" , middleware.FirebaseAuthMiddleware(http.HandlerFunc(api.Signup)))
	

	




	fs := http.FileServer(http.Dir("frontend/public"))
	http.Handle("/home/", http.StripPrefix("/home", fs))



	http.ListenAndServe(":8000", nil)





}
//Hello this is my 1st PullGame