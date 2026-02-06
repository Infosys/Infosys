package utils

import (
	"fmt"
	"sort"
	"strconv"
	"strings"
	"time"
)

// FormatValue converts a value to string representation
func FormatValue(val interface{}, exists bool) string {
	if !exists {
		return ""
	}
	if floatVal, ok := val.(float64); ok {
		return strconv.FormatFloat(floatVal, 'f', -1, 64)
	}
	return fmt.Sprintf("%v", val)
}

// compareSlices compares two string slices for equality regardless of order
func CompareSlices(a, b []string) bool {
	if len(a) != len(b) {
		return false
	}
	aCopy := append([]string{}, a...)
	bCopy := append([]string{}, b...)

	sort.Strings(aCopy)
	sort.Strings(bCopy)

	for i := range aCopy {
		if aCopy[i] != bCopy[i] {
			return false
		}
	}

	return true
}

// formatDateChange formats date change for comments
func FormatDateChange(existingDate, newDate *time.Time) string {
	existingDateStr := ""
	if existingDate != nil {
		existingDateStr = existingDate.Format("2006-01-02")
	}
	newDateStr := ""
	if newDate != nil {
		newDateStr = newDate.Format("2006-01-02")
	}
	return existingDateStr + " to " + newDateStr
}

// Format the string to human readable form
func FormatString(fieldName string) string {
	var result strings.Builder
	for i, char := range fieldName {
		if i > 0 && char >= 'A' && char <= 'Z' {
			result.WriteRune(' ')
		}
		if i == 0 {
			result.WriteRune(rune(strings.ToUpper(string(char))[0]))
		} else {
			result.WriteRune(char)
		}
	}
	return result.String()
}

// FormatFloat formats a float64 to string with two decimal places
func FormatFloat(value float64) string {
    return strings.TrimSuffix(strconv.FormatFloat(value, 'f', 2, 64), ".00")
}