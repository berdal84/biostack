
/** Base class for all Sample schemas */
export type Sample = {
    /** Unique identifier */
    id: number;
    /** Name / Label */
    name: string;
    /** Date collected */
    date: string;
    /** Type of experiment */
    type: string;
    /** Stored filename (with extension) */
    file_name: string | null;
}

/** Minimal information required to create a new Sample */
export type SampleCreate = Pick<Sample, 'name' | 'date' | 'type'>;

/** To store changes to apply to an existing Sample */
export type SampleUpdate = Partial<Pick<Sample, 'name' | 'date' | 'type'>>;