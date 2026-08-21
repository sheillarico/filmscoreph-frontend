import { isValidElement } from 'react'

function AdminTable({
  columns,
  widths,
  children,
}) {
  return (
    <div className="bg-gray-950/70 backdrop-blur-sm border border-gray-800/80 rounded-xl overflow-hidden">
      <div className="admin-table-scroll w-full overflow-x-auto overflow-y-hidden">

        <table
          className={`w-full text-sm ${
            widths?.length
              ? 'table-fixed'
              : ''
          }`}
        >
          {widths?.length > 0 && (
            <colgroup>
              {widths.map(
                (width, index) => (
                  <col
                    key={index}
                    style={{
                      width,
                    }}
                  />
                )
              )}
            </colgroup>
          )}

          <thead>
            <tr className="border-b border-gray-800/80 text-gray-500 text-[11px] uppercase tracking-wider">

              {columns.map(
                (column, index) => {
                  const isColumnConfig =
                    !isValidElement(column) &&
                    typeof column === 'object' &&
                    column !== null

                  const content =
                    isColumnConfig
                      ? column.content
                      : column

                  const align =
                    isColumnConfig
                      ? column.align ||
                        'center'
                      : 'center'

                  return (
                    <th
                      key={index}
                      className={`
                        px-3
                        py-3.5
                        font-semibold
                        whitespace-nowrap
                        align-middle

                        ${
                          align ===
                          'left'
                            ? 'text-left'
                            : align ===
                              'right'
                            ? 'text-right'
                            : 'text-center'
                        }
                      `}
                    >
                      {content}
                    </th>
                  )
                }
              )}

            </tr>
          </thead>

          <tbody className="divide-y divide-gray-900">
            {children}
          </tbody>

        </table>

      </div>

      {/* =====================================================
          HIDE TABLE SCROLLBAR VISUALLY
          
          Horizontal scrolling still works on:
          - touch devices
          - trackpads
          - mouse wheel + Shift
          - programmatic scrolling
      ====================================================== */}

      <style>
        {`
          .admin-table-scroll {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }

          .admin-table-scroll::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
          }
        `}
      </style>
    </div>
  )
}

export default AdminTable