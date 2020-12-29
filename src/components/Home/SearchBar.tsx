import React, { Component } from "react";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import Grid from "@material-ui/core/Grid";
import Games from '../Games/Games';
import MoreInfo from '../Games/Modals/MoreInfo';
import ReviewsByGame from '../Reviews/ReviewsByGame';
import "./SearchBar.css";

type FetchState = {
  openMoreInfo: boolean;
  openReviews: boolean;
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

interface Props extends WithStyles<typeof styles> {
  token: string | null,
  results: any,
  searchTerm: string,
  setResults: (results: any) => void,
  setSearchTerm: (searchTerm: string) => void,
}

class SearchBar extends Component<Props, FetchState> {
  constructor(props: any){
    super(props)
    this.state=({
      openMoreInfo: false,
      openReviews: false,
    })
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
        this.props.setResults(games)
        console.log(games);
      });
  };

  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.setResults({});
    this.fetchResults();
  };

  render() {
    const { classes } = this.props;
    return (
      <>
      <Grid container>
        <Grid item xs={12} id="searchBar">
          <h1>Level Up</h1>
          <Paper component="form" className={classes.root} id="searchBarInput">
            <InputBase
              className={classes.input}
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
              <PlayArrowIcon id='playIcon'/>
            </IconButton>
          </Paper>
        </Grid>
        {this.props.results.name && <Games openMoreInfo={() => this.setState({openMoreInfo: true})} token={this.props.token} results={this.props.results}/>}
      </Grid>
      {this.props.results.name && <MoreInfo openReviews={() => this.setState({openReviews: true})} open={this.state.openMoreInfo} onClose={() => this.setState({openMoreInfo: false})} results={this.props.results} token={this.props.token} />}
      {this.props.results.name && <ReviewsByGame  open={this.state.openReviews} token={this.props.token} results={this.props.results} onClose={() => this.setState({openReviews: false})}/>}
      </>
    );
  }
}

export default withStyles(styles)(SearchBar);