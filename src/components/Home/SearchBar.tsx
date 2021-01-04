import React, { Component } from "react";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import Grid from "@material-ui/core/Grid";
import "./SearchBar.css";

type FetchState = {
  searchTerm: string;
  results: any;
};

const styles = (theme: any) =>
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

interface Props extends WithStyles<typeof styles> {}

class SearchBar extends Component<Props, FetchState> {
  constructor(props: any) {
    super(props);
    this.state = {
      searchTerm: "",
      results: [],
    };
  }

  fetchResults = () => {
    const baseURL = "https://api.rawg.io/api/games/";
    const key = "7a9b89045e734eec9136810c89a04da4";
    let searchString = `${this.state.searchTerm}`;
    searchString = searchString.replace(/\s+/g, "-");
    let URL = `${baseURL}${searchString}?key=${key}`;

    fetch(URL)
      .then((res) => res.json())
      .then((game) => {
        this.setState({
          results: game,
        });
        console.log(game);
      });
  };

  handleSubmit = (e: any) => {
    e.preventDefault();
    this.setState({
      results: [],
    });
    this.fetchResults();
  };

  render() {
    const { classes } = this.props;
    return (
      <Grid container>
        <Grid item xs={12} id="searchBar">
          <h1>Level Up</h1>
          <Paper component="form" className={classes.root} id="searchBarInput">
            <InputBase
              className={classes.input}
              placeholder="Game Name"
              onChange={(e) => this.setState({ searchTerm: e.target.value })}
            />
            <Divider className={classes.divider} orientation="vertical" />
            <IconButton
              type="submit"
              className={classes.iconButton}
              onClick={this.handleSubmit}
            >
              <PlayArrowIcon id='playIcon'/>
            </IconButton>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(SearchBar);