import React, { Component } from "react";
import clsx from "clsx";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import {
  SwipeableDrawer,
  IconButton,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import { AccountBox, PlaylistPlay, Games, Home } from "@material-ui/icons";
import MenuIcon from "@material-ui/icons/Menu";
import "./Drawer.css";

const styles = (theme: any) =>
  createStyles({
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
      width: "auto",
    },
  });

type Anchor = "left";

interface Props extends WithStyles<typeof styles> {
  token: string | null,
}

interface State {
  left: boolean;
}

class SideDrawer extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      left: false,
    };
  }

  toggleDrawer = (anchor: Anchor, open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent
  ) => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" ||
        (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }
    this.setState({ [anchor]: open });
  };

  list = (anchor: Anchor) => (
    <div
      className={clsx(this.props.classes.list, {
        [this.props.classes.fullList]: null,
      })}
      role="presentation"
      onClick={this.toggleDrawer(anchor, false)}
      onKeyDown={this.toggleDrawer(anchor, false)}
    >
      <List>
        {["Home"].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <Home /> : <Home />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
          <ListItem button>
            <ListItemIcon>
              <AccountBox />
            </ListItemIcon>
            <ListItemText primary='My Account' />
          </ListItem>
      </List>
      <Divider />
      <List>
          <ListItem button>
            <ListItemIcon>
              <PlaylistPlay />
            </ListItemIcon>
            <ListItemText primary='Want To Play' />
          </ListItem>
      </List>
      <Divider />
      <List>
          <ListItem button>
            <ListItemIcon>
              <Games />
            </ListItemIcon>
            <ListItemText primary='Library' />
          </ListItem>
      </List>
    </div>
  );

  render() {
    return (
      <div>
        {(["left"] as Anchor[]).map((anchor: any) => (
          <React.Fragment key={anchor}>
            <IconButton onClick={this.toggleDrawer(anchor, true)}>
              <MenuIcon />
            </IconButton>
            <SwipeableDrawer
              anchor={anchor}
              open={this.state.left}
              onClose={this.toggleDrawer(anchor, false)}
              onOpen={this.toggleDrawer(anchor, true)}

            >
              {this.list(anchor)}
            </SwipeableDrawer>
          </React.Fragment>
        ))}
      </div>
    );
  }
}

export default withStyles(styles)(SideDrawer);
