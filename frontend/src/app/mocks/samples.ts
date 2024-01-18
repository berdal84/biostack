import { Sample } from "@/app/types";

/** Mock Samples to use for backend-less development */
export const MOCK_SAMPLES: Sample[] = [
    {
        id: 0,
        name: "Sample 0",
        type: 'type 1',
        date: new Date().toISOString(),
        file_name: null,
    }, {
        id: 1,
        name: "Sample 1",
        type: 'type 2',
        date: new Date().toISOString(),
        file_name: 'sample-1-my-file.txt',
    }, {
        id: 2,
        name: "Sample 2",
        type: 'type 1',
        date: new Date().toISOString(),
        file_name: null,
    }, {
        id: 3,
        name: "Sample 3",
        type: 'type 5',
        date: new Date().toISOString(),
        file_name: null,
    }, {
        id: 4,
        name: "Sample 4",
        type: 'type 1',
        date: new Date().toISOString(),
        file_name: null,
    }, {
        id: 5,
        name: "Sample 5",
        type: 'type 1',
        date: new Date().toISOString(),
        file_name: null,
    }, {
        id: 6,
        name: "Sample 6",
        type: 'type 1',
        date: new Date().toISOString(),
        file_name: null,
    }, {
        id: 7,
        name: "Sample 7",
        type: 'type 1',
        date: new Date().toISOString(),
        file_name: null,
    }, {
        id: 8,
        name: "Sample 8",
        type: 'type 1',
        date: new Date().toISOString(),
        file_name: null,
    }, {
        id: 9,
        name: "Sample 9",
        type: 'type 7',
        date: new Date().toISOString(),
        file_name: null,
    }, {
        id: 10,
        name: "Sample 10",
        type: 'type 5',
        date: new Date().toISOString(),
        file_name: null,
    }, {
        id: 11,
        name: "Sample 11",
        type: 'type 1',
        date: new Date().toISOString(),
        file_name: 'multi-depth-microscope-scan.h5',
    }, {
        id: 12,
        name: "Sample 12",
        type: 'type 2',
        date: new Date().toISOString(),
        file_name: null,
    }, {
        id: 13,
        name: "Sample 13",
        type: 'type 3',
        date: new Date().toISOString(),
        file_name: 'superscan.tiff',
    }
]