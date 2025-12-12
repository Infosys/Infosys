// import { useCallback } from "react";
// import { useAppDispatch, useAppSelector } from "../../../redux/Hooks";
// import { useGetPropertiesQuery } from "../../features/Citizen/api/Citizen.api";
// import type { Property } from "../../features/Citizen/models/Property.model";
// import { setSelectedProperty } from "../../features/Citizen/api/Property.slice";

// interface UsePropertyReturn {
//   properties: Property[];
//   selectedProperty: Property | null;
//   setSelectedProperty: (p: Property | null) => void;
//   reloadProperties: () => void;
//   loading: boolean;
//   error: string | null;
// }

// /**
//  * Hook to replace the old PropertyContext. Returns a similar shape so components
//  * can be migrated incrementally to Redux/RTK Query.
//  */
// export function useProperty(): UsePropertyReturn {
//   const dispatch = useAppDispatch();
//   const selectedProperty = useAppSelector((s) => s.property.selectedProperty);

//   const {
//     data: properties = [],
//     isLoading,
//     isFetching,
//     isError,
//     error,
//     refetch,
//   } = useGetPropertiesQuery();

//   const setSelected = useCallback(
//     (p: Property | null) => {
//       dispatch(setSelectedProperty(p));
//     },
//     [dispatch]
//   );

//   return {
//     properties,
//     selectedProperty,
//     setSelectedProperty: setSelected,
//     reloadProperties: refetch,
//     loading: isLoading || isFetching,
//     error: isError ? (error as any)?.statusText || (error as any)?.data || 'Error' : null,
//   };
// }