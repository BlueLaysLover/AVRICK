package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)


type User struct{
	ID   primitive.ObjectID		`bson:"_id,omitempty" json:"id"`
	Name 	string 				`bson:"name" json:"name"`
	Email string				`bson:"email" json:"email"`	 
	Age int 				`bson:"age" json:"age"`
	Aim  string	`bson:"aim" json:"aim"`
	LoginDate	time.Time  `bson:"date" json:"date"`
	Deadline 	time.Time 	`bson:"deadline" json:"deadline"`

	TotalHours 	int		`bson:"totalhours" json:"totalhours"`
	BeatenAvrick int 	`bson:"streak" json:"streak"`
	Streak 		int `bson:"streak" json:"streak"`
			
}

// 