"use client"
import * as React from 'react';
import { TablePagination } from '@mui/base/TablePagination';
import { Box } from '@mui/material';
import { Sample } from '@/app/types';

export type TableProps = {
    /** The rows to display for the current page */
    rows: Sample[];
    /** The current page index (zero-based) */
    page: number;
    /** A function to set a new page index */
    setPage: (n: number) => void;
    rowsPerPage: number;
    setRowsPerPage: (n: number) => void;
    /** The total item count */
    count: number;
}

/**
 * Wrapped MUI Table and TablePagination with some Tailwind style.
 * This component is stateless, user must provide it via the Props.
 * 
 * Adapted from https://mui.com/base-ui/react-table-pagination/
 */
export default function Table({ rows, page, setPage, rowsPerPage, setRowsPerPage, count }: TableProps) {

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    return (
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Date Collected</th>
                </tr>
            </thead>
            <tbody>
                {rows.map((row) => (
                    <tr key={row.id}>
                        <td>{row.name}</td>
                        <td>{row.type}</td>
                        <td>{row.date}</td>
                        {/* TODO: add a file icon if rox.file_name not null */}
                    </tr>
                ))}
            </tbody>
            <tfoot>
                <tr>
                    <TablePagination
                        className="pt-3"
                        rowsPerPageOptions={[5, 10, 25, 50, 100]}
                        colSpan={3}
                        count={count}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        slotProps={{
                            toolbar: {
                                className: 'flex flex-wrap'
                            },
                            select: {
                                'aria-label': 'rows per page',
                            },
                            displayedRows: {
                                className: 'mx-2'
                            },
                            actions: {
                                className: 'flex gap-3',
                                showFirstButton: true,
                                showLastButton: true
                            }
                        }}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </tr>
            </tfoot>
        </table>
    );
}

