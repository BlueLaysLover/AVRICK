package models

import (
	"time"
)


type StudySession struct {
    UserID    string    `bson:"userId" json:"userId"`
    StartTime time.Time `bson:"startTime" json:"startTime"`
    EndTime   time.Time `bson:"endTime" json:"endTime"`
    Duration  int       `bson:"duration" json:"duration"` 
}


// 