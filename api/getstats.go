package api

import (
	"context"
	"encoding/json"
	"log"
	"net/http"

	data "avrick.com/database"
	"go.mongodb.org/mongo-driver/bson"
)

// GetDailyStats returns the daily stats array for a user (last 365 days)
func GetDailyStats(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Extract UID from context (set by middleware)
	uid := r.Context().Value("uid")
	if uid == nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Fetch daily_stats document from MongoDB
	collection := data.Client.Database("avrick").Collection("daily_stats")

	var result struct {
		ID    string `bson:"_id"`
		Daily []int  `bson:"daily"`
	}

	err := collection.FindOne(context.Background(), bson.M{"_id": uid.(string)}).Decode(&result)

	if err != nil {
		// If document doesn't exist, return empty array
		log.Println("No daily stats found for user:", uid)
		json.NewEncoder(w).Encode(bson.M{
			"daily": []int{},
		})
		return
	}

	// Return the daily array
	json.NewEncoder(w).Encode(bson.M{
		"daily": result.Daily,
	})
}
