// API slice for GIS data operations (CRUD, batch coordinates)
import apiSlice from "../apiSlice";
import { TAG_TYPES } from "../tagTypes";
// GIS data models and API types

export interface GISDataRequest {
    propertyId: string;
    latitude: number;
    longitude: number;
    source: string;
    type: string;
}

export interface CoordinateBatchRequest {
    latitude: number;
    longitude: number;
    gisDataId: string;
}

export interface GISDataResponse {
    data: {
        ID: string;
        propertyId: string;
        latitude: number;
        longitude: number;
        source: string;
        type: string;
        createdAt: string;
    };
    message: string;
    success: boolean;
}

export interface UpdateGISDataRequest {
    gisDataId: string;
    propertyId: string;
    source: string;
    type: string;
}

export interface UpdateGISDataResponse {
    data: any;
    message: string;
    success: boolean;
}

export interface CoordinateBatchResponse {
    data: {
        coordinates: Array<{
            ID: string;
            latitude: number;
            longitude: number;
            gisDataId: string;
            createdAt: string;
        }>;
    };
    message: string;
    success: boolean;
}

export interface UpdateCoordinatesRequest {
    gisDataId: string;
    coordinates: Array<{
        latitude: number;
        longitude: number;
        gisDataId: string;
    }>;
}

export interface UpdateCoordinatesResponse {
    data: any;
    message: string;
    success: boolean;
}

export interface DeleteGISDataResponse {
    data: any;
    message: string;
    success: boolean;
}



export const gisApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Submit new GIS data for a property
        submitGISData: builder.mutation<GISDataResponse, GISDataRequest>({
            query: (data) => ({
                url: '/v1/gis-data',
                method: 'POST',
                body: {
                    propertyId: data.propertyId,
                    latitude: data.latitude,
                    longitude: data.longitude,
                    source: data.source,
                    type: data.type,
                },
            }),
            invalidatesTags: [TAG_TYPES.PROPERTY],
        }),

        // Update existing GIS data by ID
        updateGISData: builder.mutation<UpdateGISDataResponse, UpdateGISDataRequest>({
            query: ({ gisDataId, propertyId, source, type }) => ({
                url: `/v1/gis-data/${gisDataId}`,
                method: 'PUT',
                body: {
                    propertyId,
                    source,
                    type,
                },
            }),
            invalidatesTags: [TAG_TYPES.PROPERTY],
        }),

        // Delete GIS data by ID
        deleteGISData: builder.mutation<DeleteGISDataResponse, string>({
            query: (gisDataId) => ({
                url: `/v1/gis-data/${gisDataId}`,
                method: 'DELETE',
            }),
            invalidatesTags: [TAG_TYPES.PROPERTY],
        }),

        // Submit a batch of coordinates for a GIS data record
        submitCoordinateBatch: builder.mutation<CoordinateBatchResponse, CoordinateBatchRequest[]>({
            query: (coordinates) => ({
                url: '/v1/coordinates/batch',
                method: 'POST',
                body: coordinates,
            }),
            invalidatesTags: [TAG_TYPES.PROPERTY],
        }),

        // Update coordinates for a GIS data record
        updateCoordinates: builder.mutation<UpdateCoordinatesResponse, UpdateCoordinatesRequest>({
            query: ({ gisDataId, coordinates }) => ({
                url: `/v1/coordinates/gis/${gisDataId}`,
                method: 'PUT',
                body: coordinates,
            }),
            invalidatesTags: [TAG_TYPES.PROPERTY],
        }),
    })
});

// Export hooks for using GIS endpoints in components
export const {
    useSubmitGISDataMutation,
    useUpdateGISDataMutation,
    useSubmitCoordinateBatchMutation,
    useUpdateCoordinatesMutation,
    useDeleteGISDataMutation,
} = gisApi;