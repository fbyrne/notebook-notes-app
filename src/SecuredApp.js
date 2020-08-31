import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import { useAuthn } from './services/AuthenticationService';

import { IconButton, Grid, Card, CardContent, CardActions } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import NoteIcon from '@material-ui/icons/Note';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

import Copyright from './components/Copyright';
import EditNoteDialog from './components/EditNoteDialog';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1
  },
  introContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  actionButtons: {
    marginTop: theme.spacing(4),
  },
  noteGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  note: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    variant: 'outlined'
  },
  noteContent: {
    flex: '1 0 auto'
  },
  noteAdd: {
    display:'flex', 
    justifyContent:'center'
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));


function SecuredApp() {
  const classes = useStyles();
  const authn = useAuthn();

  const [notes, setNotes] = useState([]);
  const [editorNote, setEditorNote] = useState(null);


  const createNote = event => {
    async function _createNote() {
      console.log("creating note ");

      authn.withAuthn().then(() =>
        fetch('/note', {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + authn.token()
          },
          body: JSON.stringify({ content: "" })
        })
      )
        .then(apiResponse => apiResponse.json())
        .then(createdNote => {
          console.log("created note:" + createdNote);
          addNote(createdNote);
          setEditorNote(createdNote);
        }).catch(console.error);
    };
    _createNote();
  };

  const saveNote = (noteToSave) => {
    async function _saveNote() {
      console.log("saving note: " + noteToSave);

      authn.withAuthn().then(() =>
        fetch(`/note/${noteToSave.id}`, {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + authn.token()
          },
          body: JSON.stringify(noteToSave)
        })
      )
        .then(apiResponse => apiResponse.json())
        .then(savedNote => {
          console.log("updated note:" + savedNote);
          updateNote(savedNote);
          setEditorNote(null);
        }).catch(console.error);
    };
    _saveNote();
  };

  const deleteNote = note => {
    async function _deleteNote(note) {
      console.log("deleting note: " + note);

      authn.withAuthn().then(() =>
        fetch(`/note/${note.id}`, {
          method: "DELETE",
          headers: {
            'Authorization': 'Bearer ' + authn.token()
          }
        })
      )
        .then(() => {
          console.log("deleted note:" + note);
          removeNote(note);
        })
        .catch(console.error);
    };
    _deleteNote(note);
  };

  useEffect(() => {
    console.trace(`GATEWAY_DNS: ${process.env.GATEWAY_DNS ? process.env.GATEWAY_DNS : "unset"}`);
    console.log("SecuredApp.useEffect()");

    async function fetchNotes() {
      console.log("fetching notes");
      authn.withAuthn().then(() =>
        fetch('/note', {
          method: "GET",
          headers: {
            'Authorization': 'Bearer ' + authn.token()
          }
        })
      )
        .then(apiResponse => apiResponse.json())
        .then(serverNotes => {
          console.log("received notes:" + serverNotes.length);
          setNotes(serverNotes);
        })
        .catch(console.error);
    };

    fetchNotes();
  }, [/* empty to replicate componentDidMount */]);

  const addNote = (newNote) => {
    setNotes(previousNotes => [...previousNotes, newNote]);
  };

  const updateNote = (updateNote) => {
    setNotes(previousNotes => previousNotes.map(n => (n.id === updateNote.id ? updateNote : n)));
  };

  const removeNote = (noteToRemove) => {
    setNotes(previousNotes => previousNotes.filter(note => noteToRemove.id !== note.id));
  };

  const editNoteDialog = (event, noteToEdit) => {
    setEditorNote(noteToEdit);
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <NoteIcon className={classes.icon} />
          <Typography variant="h6" color="inherit" noWrap className={classes.title}>
            {authn.username()}&apos;s Notebook
          </Typography>
          <Button size="small" color="inherit" startIcon={<ExitToAppIcon />} onClick={authn.signOut}>
            Sign out
          </Button>
        </Toolbar>
      </AppBar>
      <main>
        <div className={classes.introContent}>
          <Container maxWidth="sm">
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              A place for all you might forget!
            </Typography>
          </Container>
        </div>

        <EditNoteDialog note={editorNote} handleSave={saveNote} handleCancel={()=>{setEditorNote(null)}} />

        <Container className={classes.noteGrid} maxWidth="md">
          <Grid container spacing={4} >
            <Grid item key="add-note" xs={12} sm={6} md={4} >
              <Card className={classes.note} >
              <div className={classes.addNote}>
                <CardContent >
                  <IconButton size="large" onClick={createNote}>
                    <AddIcon color="action" />
                  </IconButton>
                </CardContent>
                </div>
              </Card>
            </Grid>
            {notes.map((note) => (
              <Grid item key={note.id} xs={12} sm={6} md={4}>
                <Card className={classes.note}>
                  <CardContent className={classes.noteContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {note.title || ""}
                    </Typography>
                    <ReactQuill theme='bubble' value={note.content} readOnly/>
                  </CardContent>
                  <CardActions>
                    <IconButton size="small" onClick={(event) => editNoteDialog(event, note)}>
                      <EditIcon color="action" />
                    </IconButton>
                    <IconButton size="small" onClick={() => deleteNote(note)} >
                      <DeleteIcon color="action" />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      <footer className={classes.footer}>
        <Copyright />
      </footer>
    </React.Fragment>
  );
};

export default SecuredApp;
