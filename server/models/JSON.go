package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
)

type JSON map[string]string

// Implement the driver.Valuer interface for JSON serialization
func (j JSON) Value() (driver.Value, error) {
	return json.Marshal(j)
}

// Implement the sql.Scanner interface for JSON deserialization
func (j *JSON) Scan(value interface{}) error {
	if value == nil {
		*j = JSON{} // Initialize as an empty map if the database value is NULL
		return nil
	}

	bytes, ok := value.([]byte)
	if !ok {
		return errors.New("type assertion to []byte failed")
	}
	return json.Unmarshal(bytes, j)
}
