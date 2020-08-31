import React, { useState, createRef, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    dialogPaper: {
        minHeight: '30vh',
        maxHeight: '50vh',
    },
    content: {
        display: 'flex',
        flexDirection: 'column'
    }
}));

export default function EditNoteDialog({note, handleCancel, handleSave}) {
    const classes = useStyles();
    const [originalContent, setOriginalContent] = useState(null);
    const quillRef = createRef();

    useEffect(()=>{
        if(note)
            setOriginalContent(note.content);
    }, [note]);

    const _save = () => {
        let newValue = quillRef.current.getEditorContents();
        let newNote = Object.assign({}, note);
        newNote.content=newValue;
        handleSave(newNote);
    };

  return (
    <>
      <Dialog open={note !== null} onClose={handleCancel} maxWidth="sm" fullWidth classes={{ paper: classes.dialogPaper }}>
        <DialogTitle id="form-dialog-title">Edit Note</DialogTitle>
        <DialogContent className={classes.content} >
          <ReactQuill ref={quillRef} value={originalContent} theme='snow' />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={_save} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
