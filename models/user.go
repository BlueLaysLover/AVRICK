package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)


type User struct{
	ID   primitive.ObjectID		`bson:"_id,omitempty" json:"id"`
	UID		string 				`bson:"uid,omitempty" json:"uid"`
	Name 	string 				`bson:"name" json:"name"`
	Email string				`bson:"email" json:"email"`	 
	Age int 				`bson:"age" json:"age"`
	Aim  string	`bson:"aim" json:"aim"`
	LoginDate	time.Time  `bson:"logindate" json:"logindate"`
	Deadline 	time.Time 	`bson:"deadline" json:"deadline"`

	TotalHours 	int		`bson:"totalhours" json:"totalhours"`
	BeatenAvrick int 	`bson:"beatenavrick" json:"beatenavrick"`
	Streak 		int `bson:"streak" json:"streak"`
			
}

// 