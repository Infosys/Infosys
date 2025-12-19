// Custom Redux hooks for type-safe usage in the app
// Provides typed versions of useDispatch and useSelector
// Use these instead of the plain hooks for better type safety
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';

// Typed dispatch hook for Redux actions
export const useAppDispatch = () => useDispatch<AppDispatch>();
// Typed selector hook for accessing Redux state
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;