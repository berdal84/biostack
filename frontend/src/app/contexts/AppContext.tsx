"use client"
import { Dispatch, PropsWithChildren, createContext, useContext, useReducer } from 'react';
import { Sample, Page } from '@/app/types';

type Status = "loading" | "error" | "pending";

/** The various action types to dispatch */
type Action =
    { type: 'setStatus', payload: { status: Status, message?: string } } |
    { type: 'setPage', payload: { page: Page<Sample> } } |
    { type: string, payload: never }


/** State of the AppContext */
type AppState = {
    status: Status;
    statusMessage?: string;
    /** Cached page (last fetch result) */
    page: Page<Sample>;
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
        case 'setPage': {

            // TODO:
            // Instead of overriding fully state.page, we cache multiple pages.
            // That would be usefull to limit requests.
            // Should also provide a "refresh" action.

            return {
                ...state,
                status: "pending", // We consider one request at a time for now
                page: action.payload.page,
            }
        }
        case 'setStatus': {
            return {
                ...state,
                statusMessage: action.payload.message,
                status: action.payload.status
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
        status: "pending",
        page: {
            items: [],
            total_item_count: 0,
            index: 0,
            limit: 5
        }
    } as AppState);

    return (
        <AppContext.Provider value={state} >
            <AppDispatchContext.Provider value={dispatch} >
                {children}
            </AppDispatchContext.Provider>
        </AppContext.Provider>
    );
}
