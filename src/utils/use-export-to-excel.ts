import * as XLSX from "xlsx";

/**
 * Exports an array of objects to an Excel (.xlsx) file.
 *
 * @param data Array of records (same array passed to the table)
 * @param fileName Name of the file (without extension)
 * @param sheetName Name of the sheet inside the file
 */
export function exportToExcel<T extends Record<string, any>>(
  data: T[],
  fileName = "export",
  sheetName = "data"
) {
  if (!data || data.length === 0) {
    console.warn("exportToExcel: empty dataset");
    return;
  }

  // Convert the array of objects to a worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Create a new workbook and add the worksheet to it
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Generate and save the Excel file
  XLSX.writeFile(workbook, `${fileName}.xlsx`, { compression: true });
}
