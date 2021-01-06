import React, { Component } from "react";
import {
  createStyles,
  withStyles,
  Theme,
  WithStyles,
} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import CheckIcon from "@material-ui/icons/Check";
import LibraryDelete from "./LibraryDelete";
import LibraryInterface from "../../Interfaces/LibraryInterface";
import UserLibraryGame, {
  UserLibrary,
} from "../../Interfaces/UserLibraryInterface";
import "./Library.css";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 345,
    },
    media: {
      height: 275,
      width: 300,
    },
    rootProgress: {
      display: "flex",
      "& > * + *": {
        marginLeft: theme.spacing(2),
      },
    },
  });

interface Props extends WithStyles<typeof styles> {
  token: string | null;
}

interface State {
  userLibrary: UserLibraryGame[];
  openSnackBar: boolean;
  responseMessage: string;
  severity: "success" | "error";
  openRemoveLibrary: boolean;
  game: LibraryInterface;
}

class Library extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      userLibrary: [],
      openSnackBar: false,
      responseMessage: "",
      severity: "success",
      openRemoveLibrary: false,
      game: {
        id: 0,
        title: "",
        gameId: 0,
        gameImg: "",
        releaseDate: "",
        finished: false,
        uniqueCheck: "",
      },
    };
  }

  handleOpenSnackBar = (severity: "success" | "error", message: string) => {
    this.setState({
      severity: severity,
      responseMessage: message,
      openSnackBar: true,
    });
  };

  handleCloseSnackBar = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({
      openSnackBar: false,
    });
  };

  fetchLibrary = () => {
    const userId = localStorage.getItem("userId");
    const token = this.props.token;
    fetch(`http://localhost:4321/library/${userId}`, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `${this.props.token}`,
      }),
    })
      .then((res) => res.json())
      .then((userLibrary: UserLibrary) => {
        if (!token) {
          this.handleOpenSnackBar("error", userLibrary.message);
        } else if (!userLibrary) {
          this.handleOpenSnackBar("error", userLibrary);
        } else {
          this.setState({
            userLibrary: userLibrary.userLibrary,
          });
          const message = userLibrary.message;
          this.handleOpenSnackBar("success", message);
        }
      });
  };

  updateLibrary = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    game: LibraryInterface
  ) => {
    event.preventDefault();
    const gameId = game.id;
    const finished = game.finished;
    const token = this.props.token;
    console.log(token);
    fetch(`http://localhost:4321/library/${gameId}`, {
      method: "PUT",
      body: JSON.stringify({ finished: !finished }),
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `${this.props.token}`,
      }),
    })
      .then((response) => response.json())
      .then((userLibrary) => {
        if (!userLibrary.updatedList) {
          this.handleOpenSnackBar("error", userLibrary.message);
        } else {
          this.setState({
            userLibrary: userLibrary.updatedList,
          });
          const message = userLibrary.message;
          this.handleOpenSnackBar("success", message);
        }
      });
    this.fetchLibrary();
  };

  componentDidMount = () => {
    this.fetchLibrary();
  };

  setLibrary = (updatedList: Array<UserLibraryGame>) => {
    this.setState({
      userLibrary: updatedList,
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <>
        {this.props.token ? (
          <Grid container justify="center">
            <Grid item xs={12} id="libraryGrid">
              <Typography variant="h3" id="libraryHeading">
                <strong>MY LIBRARY</strong>
              </Typography>
            </Grid>
            {this.state.userLibrary.length &&
              this.state.userLibrary.map(
                (userLibrary: UserLibraryGame, index: number) => {
                  return (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={3}
                      id="wtpresults"
                      key={index}
                    >
                      <Card className={classes.root}>
                        <CardActionArea>
                          <CardMedia
                            className={classes.media}
                            image={userLibrary.gameImg}
                            title={"Game Image"}
                          />
                          <CardContent>
                            <Typography
                              variant="h6"
                              component="h2"
                              id="wtpGameName"
                            >
                              <strong>{userLibrary.title}</strong>
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                        <CardActions id="wtpActions">
                          <Button
                            fullWidth={true}
                            id="played"
                            onClick={(event) =>
                              this.updateLibrary(event, userLibrary)
                            }
                          >
                            <strong>
                              {userLibrary.finished ? (
                                <span id="playedIndicator">
                                  Completed <CheckIcon id="check" />
                                </span>
                              ) : (
                                "Not Completed"
                              )}
                            </strong>
                          </Button>
                          <Button
                            fullWidth={true}
                            onClick={() =>
                              this.setState({
                                openRemoveLibrary: true,
                                game: userLibrary,
                              })
                            }
                            id="remove"
                          >
                            <strong>Remove from library</strong>
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  );
                }
              )}
          </Grid>
        ) : (
          <Paper id="wtpMessage">
            <strong>
              Its pretty dark in here...Login or Sign Up to acquire the torch!
            </strong>
          </Paper>
        )}
        {this.state.openSnackBar && (
          <Snackbar
            open={this.state.openSnackBar}
            autoHideDuration={4000}
            onClose={this.handleCloseSnackBar}
          >
            <Alert
              onClose={this.handleCloseSnackBar}
              elevation={6}
              severity={this.state.severity}
              variant="filled"
            >
              {this.state.responseMessage}
            </Alert>
          </Snackbar>
        )}
        {this.state.openRemoveLibrary && (
          <LibraryDelete
            handleOpenSnackBar={this.handleOpenSnackBar}
            token={this.props.token}
            open={this.state.openRemoveLibrary}
            onClose={() => this.setState({ openRemoveLibrary: false })}
            game={this.state.game}
            setLibrary={this.setLibrary}
          />
        )}
      </>
    );
  }
}

export default withStyles(styles)(Library);
