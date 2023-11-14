package db

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

type DB struct {
	DB *sql.DB
}

func (db *DB) Initialize(user, password, dbname string) {
	connectionString :=
		fmt.Sprintf("user=%s password=%s dbname=%s sslmode=disable port=54321", user, password, dbname)

	var err error
	db.DB, err = sql.Open("postgres", connectionString)
	if err != nil {
		log.Fatal(err)
	}

}
