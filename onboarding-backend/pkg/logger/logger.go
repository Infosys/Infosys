// Package logger provides simple logging utilities for the onboarding service.
// This file implements leveled logging (info, warn, error, fatal) with key-value support.
package logger

import (
	"fmt"
	"log"
	"os"
)

var (
	infoLogger  *log.Logger
	errorLogger *log.Logger
	warnLogger  *log.Logger
	fatalLogger *log.Logger
)

// InitLogger initializes all loggers with appropriate prefixes and output streams.
func InitLogger() {
	infoLogger = log.New(os.Stdout, "INFO: ", log.Ldate|log.Ltime|log.Lshortfile)
	errorLogger = log.New(os.Stderr, "ERROR: ", log.Ldate|log.Ltime|log.Lshortfile)
	warnLogger = log.New(os.Stdout, "WARN: ", log.Ldate|log.Ltime|log.Lshortfile)
	fatalLogger = log.New(os.Stderr, "FATAL: ", log.Ldate|log.Ltime|log.Lshortfile)
}

// Info logs informational messages with optional key-value pairs.
// Initializes the logger if not already set.
func Info(message string, keyvals ...interface{}) {
	if infoLogger == nil {
		InitLogger()
	}

	logMessage := message
	for i := 0; i < len(keyvals); i += 2 {
		if i+1 < len(keyvals) {
			logMessage += " " + keyvals[i].(string) + "=" + toString(keyvals[i+1])
		}
	}
	infoLogger.Println(logMessage)
}

// Error logs error messages with optional key-value pairs.
// Initializes the logger if not already set.
func Error(message string, keyvals ...interface{}) {
	if errorLogger == nil {
		InitLogger()
	}

	logMessage := message

	if len(keyvals) > 0 {
		if err, ok := keyvals[0].(error); ok {
			logMessage += " " + err.Error()
			keyvals = keyvals[1:] // Remove the error from keyvals
		}
	}
	for i := 0; i < len(keyvals); i += 2 {
		if i+1 < len(keyvals) {
			logMessage += " " + keyvals[i].(string) + "=" + toString(keyvals[i+1])
		}
	}
	errorLogger.Println(logMessage)
}

// Warn logs warning messages with optional key-value pairs.
// Initializes the logger if not already set.
func Warn(message string, keyvals ...interface{}) {
	if warnLogger == nil {
		InitLogger()
	}

	logMessage := message
	for i := 0; i < len(keyvals); i += 2 {
		if i+1 < len(keyvals) {
			logMessage += " " + keyvals[i].(string) + "=" + toString(keyvals[i+1])
		}
	}
	warnLogger.Println(logMessage)
}

// Fatal logs fatal messages and exits the application
func Fatal(message string, keyvals ...interface{}) {
	if fatalLogger == nil {
		InitLogger()
	}

	logMessage := message
	for i := 0; i < len(keyvals); i += 2 {
		if i+1 < len(keyvals) {
			logMessage += " " + keyvals[i].(string) + "=" + toString(keyvals[i+1])
		}
	}
	fatalLogger.Println(logMessage)
	os.Exit(1) // Terminate the application
}

// toString converts an interface{} value to a string for logging.
// Supports string and error types; returns an empty string for others.
func toString(v interface{}) string {
	switch s := v.(type) {
	case string:
		return s
	case error:
		return s.Error()
	default:
		return fmt.Sprintf("%v", v)
	}
}
