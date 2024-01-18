"use client"
import * as React from 'react';
import { TablePagination } from '@mui/base/TablePagination';
import { Box } from '@mui/material';
import { Sample } from '@/app/types';

export type TableProps = {
    rows: Sample[]
}

/**
 * Wrapped MUI Table and TablePagination with some Tailwind style and a logic.
 * 
 * Adapted from https://mui.com/base-ui/react-table-pagination/
 */
export default function Table({ rows }: TableProps) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

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
        setPage(0);
    };

    return (
        <Box sx={{ maxWidth: '100%' }}>
            <table
                aria-label="custom pagination table"
            >
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Date Collected</th>
                    </tr>
                </thead>
                <tbody>
                    {(rowsPerPage > 0
                        ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : rows
                    ).map((row) => (
                        <tr key={row.id}>
                            <td>{row.name}</td>
                            <td>{row.type}</td>
                            <td>{row.date}</td>
                            {/* TODO: add a file icon if rox.file_name not null */}
                        </tr>
                    ))}
                    {emptyRows > 0 && (
                        <tr style={{ height: 41 * emptyRows }}>
                            <td colSpan={3} aria-hidden />
                        </tr>
                    )}
                </tbody>
                <tfoot>
                    <tr>
                        <TablePagination
                            className="flex row bg-pink"
                            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                            colSpan={3}
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            slotProps={{
                                select: {
                                    'aria-label': 'rows per page',
                                },
                                actions: {
                                    showFirstButton: true,
                                    showLastButton: true,
                                },
                            }}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </tr>
                </tfoot>
            </table>
        </Box>
    );
}

