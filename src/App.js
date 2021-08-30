import React from "react";
import axios from "axios";

import { TextField, Box, Grid, Toolbar, Tooltip, Typography } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';

import Header from './Header';
import ImageGrid from './ImageGrid';

const { apikey } = require('./env.json');

var colors = 'darkGreen darkGreen green goldenRod darkGoldenRod indianRed fireBrick fireBrick fireBrick fireBrick fireBrick'.split(' ');
const useStyles = theme => {
    var root = { padding: theme.spacing(3) };
    colors.forEach(color => {
        root['& .' + color] = { backgroundColor: color };
    })
    return { root: root };
};

// api functions
const url = 'https://www.omdbapi.com/';

function search(s) {
    const params = { apikey, s };
    return axios.get(url, { params })
        .then(x => x.data.Search || []);
}

function getShow(i) {
    const params = { apikey, i };
    return axios.get(url, { params })
        .then(x => x.data || []);
}

function getSeason(i, Season) {
    const params = { apikey, i, Season };
    return axios.get(url, { params });
}

function getAll(imdbID, totalSeasons) {
    var requests = [];
    for (var i = 0; i < totalSeasons; i++){
        requests.push(
            getSeason(imdbID, i + 1)
        );
    }
    return axios.all(requests)
        .then(axios.spread( (...responses) => (
            responses.map(response => response.data) 
        )));
}

class CommentForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            text: '',
            rows: [],
            show: {},
            seasons: [],
        }

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onClick = this.onClick.bind(this);
    }
    
    // hooks

    setText = text => {
        console.log(text);
        this.setState({ text });
    };

    onChange(event) { 
        event.preventDefault();     // prevents page from reloading on submit
        const text = event.target.value;
        console.log(text);
        this.setState({ text });
    }

    async onSubmit(event) { 
        event.preventDefault();     // prevents page from reloading on submit
        const rows = await search(this.state.text);
        const show = {};
        this.setState({ rows, show });
    }
    
    async onClick(imdbID) {
        const show = await getShow(imdbID);
        const rows = [];
        this.setState({ show, rows });

        const seasons = await getAll(
            this.state.show.imdbID,
            Number(this.state.show.totalSeasons),
        )
        this.setState({ seasons });     
    }

    // components

    RatingsMap() {        
        const { classes } = this.props;

        const { seasons } = this.state;
        if (!seasons.length) {
            return;
        }

        const rows = seasons.map( (season, index) => {
            var row = { id: index + 1 };
            season.Episodes.forEach(episode => {
                row[episode.Episode] = episode;
            });
            return row;
        });
        console.log(rows);

        const epNumbers = rows.map(row => Object.keys(row));
        const temp = Array.prototype.concat(...epNumbers);
        const max = Math.max(...temp
            .filter(n => n !== 'id')
            .map(n => parseInt(n)));

        const renderCell = params => (            
            <Tooltip title={(
                <Typography component='pre'>
                    {JSON.stringify(params.value, null, 4)}
                </Typography>
            )}>
                <Typography>
                    {params.value ? params.value.imdbRating : null}
                </Typography>
            </Tooltip>
        );
        var columns = [{ 
            field: 'id',
            headerName: 'S\\E',
        }]
        for (var i = 0; i < max; i++){
            columns.push({ field: i + 1, renderCell });
        }
        console.log(columns)

        const getCellClassName = params => {
            if (params.field !== 'id' && params.value) {
                const int = parseInt(params.value.imdbRating);
                return colors[10 - int];
            }
        }
        const data = {
            rows, columns, getCellClassName,
            autoHeight: true,
            className: classes.root,
        }
        return (
            <div>
                <Typography>
                    *First row is the first season,
                    second row is the second season, etc
                </Typography>
                <DataGrid {...data} />

            </div>
        );
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Header
                    text={this.state.text}
                    onChange={this.onChange}
                    onSubmit={this.onSubmit}
                />
                <Toolbar />

                <div className={classes.root}>
                    <ImageGrid
                        rows={this.state.rows}
                        onClick={this.onClick}
                    />

                    {this.RatingsMap()}
                </div>
            </div>
            
        );
    }
} // end CommentForm component

export default withStyles(useStyles)(CommentForm);