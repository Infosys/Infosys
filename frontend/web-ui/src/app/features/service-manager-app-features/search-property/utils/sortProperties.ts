// This file provides a utility function to sort a list of properties
// based on the selected sort order (by creation date).

export function sortProperties(properties: any[], selectedSort: string) {
  console.log("Sorting properties called.....");
  console.log(properties);
  
  if (selectedSort === "New - Old") {
    // Sort descending by application created date (newest first)
    return properties.sort((a, b) => 
      new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime()
    );
  }
  
  if (selectedSort === "Old - New") {
    // Sort ascending by application created date (oldest first)
    return properties.sort((a, b) => 
      new Date(a.CreatedAt).getTime() - new Date(b.CreatedAt).getTime()
    );
  }
  
  // If no recognized sort option, return properties as is
  return properties;
}