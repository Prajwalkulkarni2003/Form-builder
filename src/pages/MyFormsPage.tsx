import React from 'react'
import { useAppSelector, useAppDispatch } from '../storeHooks'
import { Table, TableHead, TableBody, TableRow, TableCell, Button, Paper } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { deleteForm } from '../features/forms/formsSlice'

export default function MyFormsPage() {
  const forms = useAppSelector(s=>s.forms.list)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  return (
    <Paper sx={{ p:2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {forms.map(f=>(
            <TableRow key={f.id}>
              <TableCell>{f.name}</TableCell>
              <TableCell>{new Date(f.createdAt).toLocaleString()}</TableCell>
              <TableCell>
                <Button onClick={()=>navigate(`/preview/${f.id}`)}>Open</Button>
                <Button color="error" onClick={()=>{ if(confirm('Delete?')) dispatch(deleteForm(f.id)) }}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
          {forms.length===0 && <TableRow><TableCell colSpan={3}>No forms saved yet</TableCell></TableRow>}
        </TableBody>
      </Table>
    </Paper>
  )
}
