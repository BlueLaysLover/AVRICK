package api

import (
	"context"

	data "avrick.com/database"
	"go.mongodb.org/mongo-driver/bson"
)

func UpdateDailyStats(uid string, minutes int) error {
    collection := data.Client.Database("avrick").Collection("daily_stats")


    // Add today's value to array, limit to last 365 entries , first push and then slice
	// limiiting the size of the array till 365 only
    _, err := collection.UpdateByID(
        context.Background(),
        uid,
        bson.M{
            "$push": bson.M{
                "daily": bson.M{
                    "$each": []int{minutes},
                    "$slice": -365,
                },
            },
            "$setOnInsert": bson.M{
                "_id": uid,
            },
        },
    )

    return err
}
