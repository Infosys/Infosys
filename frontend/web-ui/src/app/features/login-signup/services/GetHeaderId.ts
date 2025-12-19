
// Utility to fetch user ID by username and set it in HTTP headers for future requests
import httpClient from "./httpClient";


// Fetches the user by username and sets the user's ID in the HTTP client's default headers
// This is useful for APIs that require the user ID to be sent in a custom header
export async function GetHeaderId(username: string) {
    // Make a GET request to fetch user data by username
    const response = await httpClient.get(`/api/v1/users?username=${username}`);
    console.log("resp: ", response);
    
    // Extract the user ID from the response
    const newUserId = response.data.user.id;
    // Set the user ID in the default headers for future HTTP requests
    httpClient.defaults.headers.common['X-User-ID'] = newUserId;
    // Optionally, you could set the user role as well if needed
    // httpClient.defaults.headers.common['X-User-Role'] = role;
    // console.log(response.data.user);
    return;
}