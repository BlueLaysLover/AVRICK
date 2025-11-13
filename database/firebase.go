package data

import (
	"context"
	"log"

	"os"

	firebase "firebase.google.com/go"
	"google.golang.org/api/option"
)



var App *firebase.App

func InitFirebase(){
	path := "serviceaccount.json"

    if _, err := os.Stat(path); os.IsNotExist(err) {
        log.Fatal("serviceAccount.json file not found at path: ", path)
        return
    }
// will add the service file later
	opt := option.WithCredentialsFile("../serviceaccount.json")

	var err error
	App , err = firebase.NewApp(context.Background() , nil , opt)

	if err!=nil{
		log.Fatal("error initialising firebase admin sdk " ,err)
	}else{
		log.Println("Firebase initialized")
	}
}

