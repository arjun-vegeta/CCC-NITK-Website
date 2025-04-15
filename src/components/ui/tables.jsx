import React from 'react';

// A reusable table component that can be imported directly in MDX files
const Table = ({ children, className = "", ...props }) => {
    // If children are provided (MDX usage), render with children
    if (children) {
        return (
            <div className={`mb-6 overflow-auto rounded-lg border dark:border-gray-700 dark-transition ${className}`}>
                <table className="w-full border-collapse min-w-full" {...props}>
                    {children}
                </table>
            </div>
        );
    }

    // Legacy prop-based usage
    const { headers, rows } = props;

    return (
        <div className="mb-6 overflow-auto rounded-lg border dark:border-gray-700 dark-transition">
            <table className="w-full border-collapse min-w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        {headers.map((header, index) => (
                            <th
                                key={index}
                                className="px-4 py-3 bg-gray-50 dark:bg-gray-800 font-semibold text-left border-b dark:border-gray-700 text-gray-800 dark:text-gray-200 dark-transition"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            {row.map((cell, cellIndex) => (
                                <td
                                    key={cellIndex}
                                    className="px-4 py-3 border-b dark:border-gray-700 text-gray-700 dark:text-gray-300 dark-transition"
                                >
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Also export individual table elements for MDX usage
export const Thead = ({ children, className = "", ...props }) => (
    <thead className={`bg-gray-50 dark:bg-gray-800 ${className}`} {...props}>
        {children}
    </thead>
);

export const Tbody = ({ children, className = "", ...props }) => (
    <tbody className={`divide-y divide-gray-200 dark:divide-gray-700 ${className}`} {...props}>
        {children}
    </tbody>
);

export const Tr = ({ children, className = "", ...props }) => (
    <tr className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 ${className}`} {...props}>
        {children}
    </tr>
);

export const Th = ({ children, className = "", ...props }) => (
    <th
        className={`px-4 py-3 bg-gray-50 dark:bg-gray-800 font-semibold text-left border-b dark:border-gray-700 text-gray-800 dark:text-gray-200 dark-transition ${className}`}
        {...props}
    >
        {children}
    </th>
);

export const Td = ({ children, className = "", ...props }) => (
    <td
        className={`px-4 py-3 border-b dark:border-gray-700 text-gray-700 dark:text-gray-300 dark-transition ${className}`}
        {...props}
    >
        {children}
    </td>
);

export { Table };
export default Table;