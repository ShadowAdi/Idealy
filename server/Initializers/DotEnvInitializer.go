package initializers

import (
	"log"

	"github.com/joho/godotenv"
)

func DotEnv() {
	err := godotenv.Load()
	if err != nil {

		log.Fatal("Error loading .env file")
	}
}
