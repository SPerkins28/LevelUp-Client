import React, {Component} from 'react';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import {
    AppBar,
    Toolbar,
    IconButton,
    Button,
    Grid
}
from '@material-ui/core';
import Drawer from './Drawer';
import './Navbar.css';

const styles = (theme: any) => createStyles ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
  });

interface Props extends WithStyles<typeof styles>{ }

class Navbar extends Component<Props> {
  // constructor(props: any){
  //   super(props)
  // }
  
  render(){
      const { classes } = this.props;
      return (
        <div className={classes.root}>
          <AppBar position="fixed">
            <Toolbar>
              <Grid item xs={6} id="drawerButton">
                <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                  <Drawer />
                </IconButton>
              </Grid>
              <Grid item xs={6} id="title">
                <Button id="signupBut">
                  <strong>Sign Up</strong>
                </Button>
                <Button id="loginBut">
                  <strong>Login</strong>
                </Button>
              </Grid>
            </Toolbar>
          </AppBar>
        </div>
      );
    }
}

export default withStyles(styles)(Navbar);