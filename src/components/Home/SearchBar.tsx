import React, { Component } from "react";
import {
  createStyles,
  withStyles,
  Theme,
  WithStyles,
} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import Grid from "@material-ui/core/Grid";
import Games from "../Games/Games";
import MoreInfo from "../Games/Modals/MoreInfo";
import ReviewsByGame from "../Reviews/ReviewsByGame";
import ReviewCreate from "../Reviews/Modals/ReviewCreate";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import APIResponse from "../../Interfaces/APIResponse";
import "./SearchBar.css";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      marginTop: "3em",
      marginBottom: "1em",
      padding: "2px 4px",
      display: "flex",
      alignItems: "center",
      width: 400,
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
  });

interface Props extends WithStyles<typeof styles> {
  token: string | null;
  results: APIResponse | undefined;
  searchTerm: string;
  setResults: (results: APIResponse | undefined) => void;
  setSearchTerm: (searchTerm: string) => void;
}

type FetchState = {
  openMoreInfo: boolean;
  openReviews: boolean;
  openReviewCreate: boolean;
  openReviewUpdate: boolean;
  openSnackBar: boolean;
  responseMessage: string;
  severity: "success" | "error";
};

class SearchBar extends Component<Props, FetchState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      openMoreInfo: false,
      openReviews: false,
      openReviewCreate: false,
      openReviewUpdate: false,
      openSnackBar: false,
      responseMessage: "",
      severity: "success",
    };
  }

  fetchResults = () => {
    const baseURL = "https://api.rawg.io/api/games/";
    const key = "7a9b89045e734eec9136810c89a04da4";
    let searchString = `${this.props.searchTerm}`;
    searchString = searchString.replace(/\s+/g, "-");
    let URL = `${baseURL}${searchString}?key=${key}`;

    fetch(URL)
      .then((res) => res.json())
      .then((games) => {
        this.props.setResults(games);
        console.log(games);
      });
  };

  handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    this.props.setResults(undefined);
    this.fetchResults();
  };

  handleClickOpen = () => {
    this.setState({
      openReviews: true,
    });
  };

  handleClickOpenReviewCreate = () => {
    this.setState({
      openReviewCreate: true,
    });
  };

  handleClickOpenReviewUpdate = () => {
    this.setState({
      openReviewUpdate: true,
    });
  };

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

  render() {
    const { classes } = this.props;
    return (
      <>
        <Grid container>
          <Grid item xs={12} id="searchBar">
            <h1>Level Up</h1>
            <Paper
              component="form"
              className={classes.root}
              id="searchBarInput"
            >
              <InputBase
                className={classes.input}
                id="searchTerm"
                value={this.props.searchTerm}
                placeholder="Game Name"
                onChange={(e) => this.props.setSearchTerm(e.target.value)}
              />
              <Divider className={classes.divider} orientation="vertical" />
              <IconButton
                type="submit"
                className={classes.iconButton}
                onClick={this.handleSubmit}
              >
                <PlayArrowIcon id="playIcon" />
              </IconButton>
            </Paper>
          </Grid>
          {this.props.results && (
            <Games
              openMoreInfo={() => this.setState({ openMoreInfo: true })}
              token={this.props.token}
              results={this.props.results}
              handleOpenSnackBar={this.handleOpenSnackBar}
            />
          )}
        </Grid>
        {this.props.results && (
          <MoreInfo
            openReviews={this.handleClickOpen}
            open={this.state.openMoreInfo}
            onClose={() => this.setState({ openMoreInfo: false })}
            handleClose={() => this.setState({ openMoreInfo: false })}
            results={this.props.results}
            token={this.props.token}
            handleOpenSnackBar={this.handleOpenSnackBar}
          />
        )}
        {this.props.results && this.state.openReviews && (
          <ReviewsByGame
            openReviewCreate={this.handleClickOpenReviewCreate}
            openMoreInfo={() => this.setState({ openMoreInfo: true })}
            showReviews={() => this.setState({ openReviews: true })}
            open={this.state.openReviews}
            token={this.props.token}
            results={this.props.results}
            handleClose={() => this.setState({ openMoreInfo: false })}
            onClose={() => this.setState({ openReviews: false })}
          />
        )}
        {this.props.results && this.state.openReviewCreate && (
          <ReviewCreate
            token={this.props.token}
            results={this.props.results}
            open={this.state.openReviewCreate}
            onClose={() => this.setState({ openReviewCreate: false })}
            handleClose={() => this.setState({ openReviews: false })}
            openReviews={() => this.setState({ openReviews: true })}
            showReviewCreate={() => this.setState({ openReviewCreate: true })}
            handleOpenSnackBar={this.handleOpenSnackBar}
          />
        )}
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
      </>
    );
  }
}

export default withStyles(styles)(SearchBar);
