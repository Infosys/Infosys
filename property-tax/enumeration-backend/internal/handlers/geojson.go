package handlers

import (
    "context"
    "encoding/json"
    "fmt"
    "time"

    "github.com/gin-gonic/gin"
    "github.com/redis/go-redis/v9"
    workflow "enumeration/internal/clients"
    "enumeration/internal/config"
)

// GeoJSONHandler handles HTTP requests for document resources.
type GeoJSONHandler struct {
    cfg         *config.Config
    redisClient *redis.Client
}

// NewGeoJSONHandler creates a new GeoJSONHandler with the provided service.
func NewGeoJSONHandler(cfg *config.Config, redisClient *redis.Client) *GeoJSONHandler {
    return &GeoJSONHandler{
        cfg:         cfg,
        redisClient: redisClient,
    }
}

func (h *GeoJSONHandler) GetWardInfo(c *gin.Context) {
    idParam := c.Param("id")
    ctx := c.Request.Context()
    
    // Create cache key
    cacheKey := fmt.Sprintf("ward_info:%s", idParam)
    
    // Try to get from cache
    if h.redisClient != nil {
        cachedData, err := h.redisClient.Get(ctx, cacheKey).Bytes()
        if err == nil {
            // Cache hit
            var wardInfo interface{}
            if err := json.Unmarshal(cachedData, &wardInfo); err == nil {
                fmt.Println("Ward info retrieved from cache")
                c.JSON(200, wardInfo)
                return
            }
        } else if err != redis.Nil {
            // Log error but continue to fetch from source
            fmt.Printf("Redis get error: %v\n", err)
        }
    }
    
    // Cache miss - fetch from source
    wardInfo, err := workflow.GetWardInfo(h.cfg.FileStoreURL, idParam)
    if err != nil {
        c.JSON(500, gin.H{"error": "Failed to get ward info"})
        return
    }
    
    // Store in cache (async to not block response)
    if h.redisClient != nil {
        go func() {
            cacheCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
            defer cancel()
            
            data, err := json.Marshal(wardInfo)
            if err != nil {
                fmt.Printf("Failed to marshal ward info for cache: %v\n", err)
                return
            }
            
            // Cache for 1 hour
            if err := h.redisClient.Set(cacheCtx, cacheKey, data, 1*time.Hour).Err(); err != nil {
                fmt.Printf("Failed to cache ward info: %v\n", err)
            } else {
                fmt.Println("Ward info cached successfully")
            }
        }()
    }
    
    c.JSON(200, wardInfo)
}