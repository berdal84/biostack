"use client"
import { Dispatch, PropsWithChildren, createContext, useContext, useReducer } from 'react';
import { Sample, Page } from '@/app/types';
import { MOCK_SAMPLES } from '@/app/mocks/samples';

/** The various action types to dispatch */
type Action = { type: 'fetch', payload: Partial<{ page: number, limit: number }> }

/** State of the AppContext */
type AppState = {
    /** True when a new page is being fetched */
    isLoading: boolean;
    /** Page returned by the last fetch */
    page: Page<Sample>;
    /** Current page index (zero-based) */
    pageIndex: number;
    /** Current page limit */
    pageLimit: number;
}

const AppContext = createContext<AppState | null>(null);
const AppDispatchContext = createContext<Dispatch<Action> | null>(null);

/**
 * Short had to get AppContext and check for null
 */
export function useAppContext(): AppState | never {
    const context = useContext(AppContext);
    if (context === null) {
        throw new Error("Unable to use the context. Did you wrapped this component in a AppContextProvider?")
    }
    return context;
}

/**
 * Short had to get AppDispatchContext and check for null
 */
export function useAppDispatchContext(): Dispatch<Action> | never {
    const context = useContext(AppDispatchContext);
    if (context === null) {
        throw new Error("Unable to use the dispatch context. Did you wrapped this component in a AppContextProvider?")
    }
    return context;
}

function appReducer(state: AppState, action: Action): AppState {
    switch (action.type) {
        case 'fetch': {

            // Compute new page index, offset and limit
            const newPageIndex = action.payload.page ?? state.pageIndex;
            const newPageLimit = action.payload.limit ?? state.pageLimit
            const offset = newPageIndex * newPageLimit;

            // Fetch
            // TODO: use API, not from here though
            const newPage = {
                items: MOCK_SAMPLES.slice(offset, offset + newPageLimit),
                total_item_count: MOCK_SAMPLES.length
            }

            // Update state
            return {
                ...state,
                pageIndex: newPageIndex,
                pageLimit: newPageLimit,
                page: newPage,
            }
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}

/**
 * AppContext provider, wrap all the components relying on AppContext or AppDispatchContext
 */
export function AppContextProvider({ children }: PropsWithChildren) {

    const [state, dispatch] = useReducer(appReducer, {
        isLoading: false,
        page: {
            items: [],
            total_item_count: 0
        },
        pageIndex: 0,
        pageLimit: 5,
    } as AppState);

    return (
        <AppContext.Provider value={state} >
            <AppDispatchContext.Provider value={dispatch} >
                {children}
            </AppDispatchContext.Provider>
        </AppContext.Provider>
    );
}
