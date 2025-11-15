package models

import (
	"time"
)


type StudySession struct {
    UserID    string    `bson:"userId" json:"userId"`
    StartTime time.Time `bson:"startTime" json:"startTime"`
    EndTime   time.Time `bson:"endTime,omitempty" json:"endTime"`
    Notes      string   `bson:"notes" json:"notes"`
    Duration  int       `bson:"duration" json:"duration"` 
}


// 