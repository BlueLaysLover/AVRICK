package api

import (
	"encoding/json"
	"log"
	"net/http"

	data "avrick.com/database"
	"avrick.com/models"
	"go.mongodb.org/mongo-driver/bson"
)


func Signup(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")


	// this context is filled by firebaseauthmiddleware after verifying token
	uid := r.Context().Value("uid")
	email := r.Context().Value("userEmail")

	if uid == nil || email == nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}


	newuser:= models.User{
		Email: email.(string),

	}


	// in this line user is added in the db
	collection :=data.Client.Database("avrick").Collection("users")


	_ , err:= collection.InsertOne(r.Context() , newuser)

	if err != nil {
		http.Error(w, "Failed to create user", http.StatusInternalServerError)
		log.Println("error adding document "  , err)
		return
	}

	

	w.WriteHeader(http.StatusCreated)

	// frontend console
	json.NewEncoder(w).Encode(bson.M{
		"message": "Signup successful",
		"uid":     uid,
		"email":   email,
	})



}
