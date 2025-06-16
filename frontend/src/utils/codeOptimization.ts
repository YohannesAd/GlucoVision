/**
 * Code Optimization Utilities
 * Professional patterns for reducing code length while maintaining readability
 */

// Generic error handler for API calls
export const handleApiError = (error: any, defaultMessage: string): string => {
  return error instanceof Error ? error.message : defaultMessage;
};

// Generic async action wrapper for reducers
export const createAsyncAction = <T>(
  dispatch: React.Dispatch<any>,
  startAction: string,
  successAction: string,
  failureAction: string
) => {
  return async (apiCall: () => Promise<T>): Promise<T> => {
    dispatch({ type: startAction });
    try {
      const result = await apiCall();
      dispatch({ type: successAction, payload: result });
      return result;
    } catch (error) {
      dispatch({ type: failureAction, payload: handleApiError(error, 'Operation failed') });
      throw error;
    }
  };
};

// Simplified context creator
export const createSimpleContext = <T>(name: string) => {
  const Context = React.createContext<T | undefined>(undefined);
  
  const useContext = (): T => {
    const context = React.useContext(Context);
    if (!context) throw new Error(`use${name} must be used within a ${name}Provider`);
    return context;
  };
  
  return [Context, useContext] as const;
};

// Condensed reducer pattern
export const createReducer = <State, Action extends { type: string }>(
  initialState: State,
  handlers: Record<string, (state: State, action: any) => State>
) => {
  return (state: State, action: Action): State => {
    const handler = handlers[action.type];
    return handler ? handler(state, action) : state;
  };
};
