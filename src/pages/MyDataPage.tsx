import React from 'react'
import { useAppSelector, useAppDispatch } from '../storeHooks'
import { Table, TableHead, TableBody, TableRow, TableCell, Paper, Button } from '@mui/material'
import { deleteEntry } from '../features/formData/formDataSlice'

export default function MyDataPage() {
  const entries = useAppSelector(s => s.formData.entries)
  const forms = useAppSelector(s => s.forms.list)
  const dispatch = useAppDispatch()

  return (
    <Paper sx={{ p: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Form Name</TableCell>
            <TableCell>Submitted At</TableCell>
            <TableCell>Values</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {entries.map(e => (
            <TableRow key={e.id}>
              <TableCell>{e.formName}</TableCell>
              <TableCell>{new Date(e.createdAt).toLocaleString()}</TableCell>
              <TableCell>
                {(() => {
                  const form = forms.find(f => f.id === e.formId);
                  if (!form) {
                    return <em>Form schema not found</em>;
                  }
                  return (
                    <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                      {form.fields.map(f => (
                        <li key={f.id}>
                          <strong>{f.label}:</strong> {String(e.values[f.id] ?? '')}
                        </li>
                      ))}
                    </ul>
                  );
                })()}
              </TableCell>
              <TableCell>
                <Button color="error" onClick={() => dispatch(deleteEntry(e.id))}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {entries.length === 0 && (
            <TableRow>
              <TableCell colSpan={4}>No submissions yet</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  )
}
