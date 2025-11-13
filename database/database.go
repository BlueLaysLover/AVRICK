package data

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)


var Client *mongo.Client

func ConnectDB() *mongo.Client{

	ctx , cancel:= context.WithTimeout(context.Background() , 10*time.Second)
	defer cancel()

	err:= godotenv.Load(".env")
	if err!=nil{
		log.Fatal("Error loading .env file")
	}

	clientOptions:= options.Client().ApplyURI(os.Getenv("MONGODB_CONNECTION_URL"))

	client , err := mongo.Connect(ctx , clientOptions)

	if err != nil{
		log.Fatal(err)
	}

	err = client.Ping(ctx , nil)

	if err != nil{
		log.Fatal(err)
	}

	log.Println("CONNECTED TO MONGODB")
	Client = client

	return client

}
