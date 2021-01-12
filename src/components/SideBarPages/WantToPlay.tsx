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
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import Paper from "@material-ui/core/Paper";
import Alert from "@material-ui/lab/Alert";
import CheckIcon from "@material-ui/icons/Check";
import WantToPlayDelete from "./WantToPlayDelete";
import UserWTPInterface from "../../Interfaces/UserWTPInterface";
import UserWantToPlayGame, {
  UserWantToPlay,
} from "../../Interfaces/WTPInterface";
import "./WantToPlay.css";
import APIURL from "../../helpers/environment";

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
  userWantToPlay: UserWantToPlayGame[];
  openSnackBar: boolean;
  responseMessage: string;
  severity: "success" | "error";
  openRemoveWTP: boolean;
  game: UserWTPInterface;
}

class WantToPlay extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      userWantToPlay: [],
      openSnackBar: false,
      responseMessage: "",
      severity: "success",
      openRemoveWTP: false,
      game: {
        id: 0,
        title: "",
        gameId: 0,
        gameImg: "",
        releaseDate: "",
        played: false,
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

  fetchWTP = () => {
    const userId = localStorage.getItem("userId");
    const token = this.props.token;
    fetch(`${APIURL}/wanttoplay/${userId}`, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `${this.props.token}`,
      }),
    })
      .then((res) => res.json())
      .then((userWantToPlay: UserWantToPlay) => {
        if (!token) {
          this.handleOpenSnackBar("error", userWantToPlay.message);
        } else if (!userWantToPlay) {
          this.handleOpenSnackBar("error", userWantToPlay);
        } else {
          this.setState({
            userWantToPlay: userWantToPlay.userWantToPlay,
          });
          const message = userWantToPlay.message;
          this.handleOpenSnackBar("success", message);
        }
      });
  };

  updateWTP = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    game: UserWTPInterface
  ) => {
    event.preventDefault();
    const wtpId = game.id;
    const played = game.played;
    fetch(`${APIURL}/wanttoplay/${wtpId}`, {
      method: "PUT",
      body: JSON.stringify({ played: !played }),
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `${this.props.token}`,
      }),
    })
      .then((response) => response.json())
      .then((userWantToPlay) => {
        if (!userWantToPlay.updatedList) {
          this.handleOpenSnackBar("error", userWantToPlay.message);
        } else {
          this.setState({
            userWantToPlay: userWantToPlay.updatedList,
          });
          const message = userWantToPlay.message;
          this.handleOpenSnackBar("success", message);
        }
      });
    this.fetchWTP();
  };

  componentDidMount = () => {
    this.fetchWTP();
  };

  setUserWantToPlay = (updatedList: Array<UserWantToPlayGame>) => {
    this.setState({
      userWantToPlay: updatedList,
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <>
        {this.props.token ? (
          <Grid container justify="center">
            <Grid item xs={12} id="wtpGrid">
              <Typography variant="h3" id="wtpHeading">
                <strong>WANT TO PLAY</strong>
              </Typography>
            </Grid>
            {this.state.userWantToPlay.length &&
              this.state.userWantToPlay.map(
                (userWTP: UserWantToPlayGame, index: number) => {
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
                            image={userWTP.gameImg}
                            title={"Game Image"}
                          />
                          <CardContent>
                            <Typography
                              variant="h6"
                              component="h2"
                              id="wtpGameName"
                            >
                              <strong>{userWTP.title}</strong>
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                        <CardActions id="wtpActions">
                          <Button
                            fullWidth={true}
                            id="played"
                            onClick={(event) => this.updateWTP(event, userWTP)}
                          >
                            <strong>
                              {userWTP.played ? (
                                <span id="playedIndicator">
                                  Played <CheckIcon id="check" />
                                </span>
                              ) : (
                                "Not Played"
                              )}
                            </strong>
                          </Button>
                          <Button
                            fullWidth={true}
                            onClick={() =>
                              this.setState({
                                openRemoveWTP: true,
                                game: userWTP,
                              })
                            }
                            id="remove"
                          >
                            <strong>Remove from list</strong>
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
        {this.state.openRemoveWTP && (
          <WantToPlayDelete
            handleOpenSnackBar={this.handleOpenSnackBar}
            token={this.props.token}
            open={this.state.openRemoveWTP}
            onClose={() => this.setState({ openRemoveWTP: false })}
            game={this.state.game}
            setUserWantToPlay={this.setUserWantToPlay}
          />
        )}
      </>
    );
  }
}

export default withStyles(styles)(WantToPlay);
