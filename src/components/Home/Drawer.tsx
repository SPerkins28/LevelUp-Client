import React, { Component } from "react";
import clsx from "clsx";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import {
  SwipeableDrawer,
  IconButton,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import {
  AccountBox,
  PlaylistPlay,
  Games,
  Home,
  SupervisorAccount,
} from "@material-ui/icons";
import MenuIcon from "@material-ui/icons/Menu";
import "./Drawer.css";

const styles = (theme: Theme) =>
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
  role: "user" | "admin" | "banned";
  token: string | null
}

interface State {
  left: boolean;
}

class SideDrawer extends Component<Props, State> {
  constructor(props: Props) {
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
      id="drawer"
    >
      <List>
        <ListItem button id="searchBarLink">
          <Link to="/" className="links">
            <ListItemIcon className="drawerIcons">
              <Home />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </Link>
        </ListItem>
      </List>
      <Divider />
      {this.props.token && localStorage.getItem("role") !== "banned" ? (
        <>
          <List>
            <ListItem button id="myAccountLink">
              <Link to="/myaccount" className="links">
                <ListItemIcon className="drawerIcons">
                  <AccountBox />
                </ListItemIcon>
                <ListItemText primary="My Account" />
              </Link>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button id="wantToPlayLink">
              <Link to="/wanttoplay" className="links">
                <ListItemIcon className="drawerIcons">
                  <PlaylistPlay />
                </ListItemIcon>
                <ListItemText primary="Want To Play" />
              </Link>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button id="libraryLink">
              <Link to="/library" className="links">
                <ListItemIcon className="drawerIcons">
                  <Games />
                </ListItemIcon>
                <ListItemText primary="Library" />
              </Link>
            </ListItem>
          </List>
          <Divider />
        </>
      ) : null}
      <>
        {localStorage.getItem("role") === "admin" ? (
          <List>
            <ListItem button id="adminLink">
              <Link to="/admin" className="links">
                <ListItemIcon className="drawerIcons">
                  <SupervisorAccount />
                </ListItemIcon>
                <ListItemText primary="Admin" />
              </Link>
            </ListItem>
          </List>
        ) : null}
      </>
    </div>
  );

  render() {
    return (
      <div>
        {(["left"] as Anchor[]).map((anchor) => (
          <React.Fragment key={anchor}>
            <IconButton
              onClick={this.toggleDrawer(anchor, true)}
              className="drawerIcons"
            >
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
