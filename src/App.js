import React, { Component } from 'react';

import './App.css';
import theme from './theme';

import Keycloak from 'keycloak-js';

import { withStyles } from '@material-ui/core/styles';

import {Accordion, AccordionSummary, AccordionDetails} from '@material-ui/core';

import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import {MenuIcon, NoteIcon, ExpandMoreIcon} from '@material-ui/icons';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
});

class App extends Component {

  constructor(props) {
    super(props);
    this.state = { keycloak: null, authenticated: false, notes: null };
  }

  componentDidMount() {
    const keycloak = new Keycloak('/keycloak.json');
    keycloak.init({ onLoad: 'login-required', promiseType: 'native' })
      .then(authenticated => {
        this.setState({ keycloak: keycloak, authenticated: authenticated })

        fetch('http://notebook-172-17-0-2.nip.io/note', {
          method: 'get',
          headers: new Headers({
            'Authorization': 'Bearer ' + keycloak.token
          })
        })
          .then(res => res.text())
          .then(notes => {
            console.log('Success:', notes);
            this.setState({ notes: notes });
          });
      });
  }


  render() {
    const { classes } = this.props
    if (this.state.keycloak) {
      if (this.state.authenticated) return (
        <div className="App">
          <CssBaseline />
          <AppBar position="static">
            <Toolbar>
              <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                Notebook: {this.state.keycloak.tokenParsed.name}
              </Typography>
              {/* 
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography className={classes.heading}>JWT Token</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography >{this.state.keycloak.token}</Typography>
                </AccordionDetails>
              </Accordion> 
              */}
              <Button color="inherit" onClick={this.state.keycloak.logout}>Logout</Button>
            </Toolbar>
          </AppBar>
          <List>
            <ListItem button>
              <ListItemIcon>
                <NoteIcon />
              </ListItemIcon>
              <ListItemText primary="Chelsea Otakan" />
            </ListItem>
          </List>
          <Container >
            <ReactQuill theme="snow" value={this.state.keycloak.token} />
          </Container>
        </div>
      ); else return (<div>Unable to authenticate!</div>)
    }
    return (
      <div>Initializing Keycloak...</div>
    );
  }

}

export default withStyles(styles(theme))(App);
