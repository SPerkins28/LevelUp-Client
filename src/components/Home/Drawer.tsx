import React, {Component} from 'react';
import clsx from 'clsx';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import {
    Drawer,
    IconButton,
    List,
    Divider,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@material-ui/core';
import {
    AccountBox,
    PlaylistPlay,
    Games,
    Home
} from '@material-ui/icons';
import MenuIcon from '@material-ui/icons/Menu';
import './Drawer.css'

const styles = (theme: any) => createStyles({
    root: {
        flexGrow: 1,
      },
      menuButton: {
        marginRight: theme.spacing(2),
      },
    list: {
      width: 250,
    },
    fullList: {
      width: 'auto',
    },
  });
  
type Anchor = 'left';

interface Props extends WithStyles<typeof styles>{ }

class SideDrawer extends Component<Props> {
    constructor(props: any){
        super(props)
        this.state= ({
            left: false
        })
    }

    toggleDrawer = (anchor: Anchor, open: boolean) => (
        event: React.KeyboardEvent | React.MouseEvent,
      ) => {
        if (
          event.type === 'keydown' &&
          ((event as React.KeyboardEvent).key === 'Tab' ||
            (event as React.KeyboardEvent).key === 'Shift')
        ) {
          return;
        }
        this.setState({state: this.state, [anchor]: open });
      };

    list = (anchor: Anchor) => (
        <div
          className={clsx(this.props.classes.list, {
            [this.props.classes.fullList]: null
          })}
          role="presentation"
          onClick={this.toggleDrawer(anchor, false)}
          onKeyDown={this.toggleDrawer(anchor, false)}
        >
            <List>
            {['Home'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>{index % 2 === 0 ? <Home /> : <Home />}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {['My Account'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>{index % 2 === 0 ? <AccountBox /> : <AccountBox />}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {['Want To Play'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>{index % 2 === 0 ? <PlaylistPlay /> : <PlaylistPlay />}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {['Library'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>{index % 2 === 0 ? <Games /> : <Games />}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </div>
      );

    render(){
        return(
            <div>
                    {(['left'] as Anchor[]).map((anchor: any) => (
                        <React.Fragment key={anchor}>
                        <IconButton onClick={this.toggleDrawer(anchor, true)}>
                            <MenuIcon />
                        </IconButton>
                        <Drawer id="MuiDrawer-paper" anchor={anchor} open={anchor} onClose={this.toggleDrawer(anchor, false)}>
                            {this.list(anchor)}
                        </Drawer>
                        </React.Fragment>
                    ))}
            </div>
        )
    }
}

export default withStyles(styles)(SideDrawer);