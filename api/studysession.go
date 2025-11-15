package api

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	data "avrick.com/database"
	"avrick.com/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)


func StartStudySession(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")

	// auth ke liye  , uid firebase 
    uid := r.Context().Value("uid")
    if uid == nil {
        http.Error(w, "Unauthorized", http.StatusUnauthorized)
        return
    }

    var req models.StudySession
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, "Invalid body", http.StatusBadRequest)
        return
    }
	// if start time is not mentioned in the body then it is assumed the current time
    if req.StartTime.IsZero() {
        req.StartTime = time.Now()
    }

	// mongo db 
	collection := data.Client.Database("avrick").Collection("sessions")


	//this check if endtime row is in the data or not , if no then active session
	var active models.StudySession
	err := collection.FindOne(r.Context(), bson.M{
		"userId": uid,
		"endTime": bson.M{"$exists": false},
	}).Decode(&active)

	if err == nil {
		// Found an active session
		http.Error(w, "You already have an active session", 400)
		return
	}



    session := models.StudySession{
        UserID:    uid.(string),
        StartTime: req.StartTime,	
        Notes:     req.Notes,
        Duration:  0, // will be updated when the session is ended
    }

    
	res, err := collection.InsertOne(r.Context(), session)
    if err != nil {
        http.Error(w, "DB insert error", http.StatusInternalServerError)
        return
    }

    json.NewEncoder(w).Encode(bson.M{
        "message": "Session started",
        "sessionId": res.InsertedID,
    })
}




func EndStudySession(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")

    uid := r.Context().Value("uid")
    if uid == nil {
        http.Error(w, "Unauthorized", http.StatusUnauthorized)
        return
    }

    var req struct {
        SessionID string    `json:"sessionId"`
        EndTime   time.Time `json:"endTime"`
    }
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, "Invalid body", http.StatusBadRequest)
        return	
    }

    if req.EndTime.IsZero() {
        req.EndTime = time.Now()
    }

    sessionObjectID, err := primitive.ObjectIDFromHex(req.SessionID)
    if err != nil {
        http.Error(w, "Invalid session ID", http.StatusBadRequest)
        return
    }

    // Fetch original session
    collection := data.Client.Database("avrick").Collection("sessions")

    var session models.StudySession
    err = collection.FindOne(r.Context(), bson.M{
        "_id": sessionObjectID,
        "userId": uid.(string),
    }).Decode(&session)

    if err != nil {
        http.Error(w, "Session not found", http.StatusNotFound)
        return
    }

    // Compute duration
    duration := int(req.EndTime.Sub(session.StartTime).Minutes())

    // Update the session
    _, err = collection.UpdateByID(r.Context(), sessionObjectID, bson.M{
        "$set": bson.M{
            "endTime":  req.EndTime,
            "duration": duration,
        },
    })
    if err != nil {
        http.Error(w, "DB update error", http.StatusInternalServerError)
        return
    }
    err = UpdateDailyStats(uid.(string) , duration)
    if err!=nil{
        log.Println("Error updating daily stats")
        return 
    }


    json.NewEncoder(w).Encode(bson.M{
        "message":  "Session ended",
        "duration": duration,
    })
}
