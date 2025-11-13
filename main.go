package main

import (
	data "avrick.com/database"
)

func main() {
    
	data.ConnectDB()
	data.InitFirebase()


}
