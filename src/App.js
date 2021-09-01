import React, { useState, Component } from 'react';
import { Grid, Paper, TextField, Typography, Button, Toolbar, Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { DataGrid } from '@material-ui/data-grid';
import { ExpandMore } from '@material-ui/icons';

import Header from './Header';

const axios = require('axios');
const tf = require('@tensorflow/tfjs');

const useStyles = theme => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(1),
    },
    title: {
        padding: theme.spacing(1),
    },
    paper: {
        padding: theme.spacing(1),
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: '100%',
    },
});

const width = 133;
const columns = [
    { field: 'id' },
    { field: 'index', width },
    { field: 'payoff', width },
];

const url = 'https://us-central1-georgefane.cloudfunctions.net/pmsolver';

function getShape(players, strats) {
    const shape = new Array(players).fill(strats).concat(players)
    console.log(shape);
    return shape;
}

function getTensor(shape, values = false) {
    var tensor;
    try {
        tensor = tf.tensor(values, shape);
    }
    catch (error) {
        console.log(error);
        const top = shape.reduce( (a, b) => a * b);
        tensor = tf.randomUniform(shape, 0, top, 'int32');
    }

    tensor.print();
    return tensor;
}

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            players: 2,
            strats: 2,
            rows: [],
            loading: false,
            matrix: '',
            tensor: false,
            indexes: [],
        };
    }

    onClick = async () => {
        const { players, strats, matrix } = this.state;

        const shape = getShape(players, strats);
        var values;
        try {
            values = JSON.parse(matrix);
        }
        catch {
            values = null;
        }

        const tensor = getTensor(shape, values);
        this.setState({ tensor });

        const data = tensor.arraySync();
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        const resp = await axios.post(url, { data, headers });
        console.log(resp);
        const indexes = resp.data.data;
        console.log(indexes);
        this.setState({ indexes });
    }

    Dgrid() {
        const { loading, indexes, tensor } = this.state;
        if (!tensor) {
            return <div />;
        }

        const rows = indexes.map( ([index, payoff], id) => (
            { id, index, payoff }
        ));

        const data = { rows, columns, loading, autoHeight: true }
        return <DataGrid {...data} />;
    }

    Accord() {
        const { classes } = this.props;
        const { loading, indexes, tensor } = this.state;
        if (!tensor) {
            return <div />;
        }

        return (
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMore />}
                >
                    <Typography className={classes.heading}>
                        Payoff Matrix
                    </Typography>
                </AccordionSummary>

                <AccordionDetails>
                    <Typography component='pre'>
                        {tensor.toString(true)}
                    </Typography>
                </AccordionDetails>
            </Accordion>
        )
    }

    render() {
        const { classes } = this.props;
        const { players, strats, matrix, tensor } = this.state;

        return (
            <div>
                <Header />
                <Toolbar />

                <div className={classes.root}>

                    <Typography variant='h6'>
                        If the 'Payoff Matrix' field is blank, a random payoff matrix is generated. You can input your matrix flat or nested.
                    </Typography>

                    <Grid container spacing={1}>
                        
                        <Grid item xs>
                            <Paper className={classes.paper}>                    
                                <Typography variant='h6'>
                                    Input Payoff Matrix:
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs>
                            <Paper className={classes.paper}>                    
                                <TextField 
                                    label="No. Players" type='number' required
                                    value={players}
                                    onChange={(event) => {
                                        var players = Number(event.target.value);
                                        this.setState({ players });
                                    }}
                                />
                            </Paper>
                        </Grid>
                        
                        <Grid item xs>
                            <Paper className={classes.paper}>                    
                                <TextField 
                                    label="No. Strategies" type='number' required
                                    value={strats}
                                    onChange={event => {
                                        var strats = Number(event.target.value);
                                        this.setState({ strats });
                                    }}
                                />
                            </Paper>
                        </Grid>

                        <Grid item xs>
                            <Paper className={classes.paper}>                    
                                <TextField 
                                    label="Payoff Matrix"
                                    value={matrix}
                                    onChange={event => {
                                        const matrix = event.target.value;
                                        this.setState({ matrix });
                                    }}
                                />
                            </Paper>
                        </Grid>
                    </Grid>
                    <br /><br />

                    <Grid container spacing={3}>
                    <Grid item>
        
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={this.onClick}
                        >
                            Submit
                        </Button>

                    </Grid>

                    <Grid item>

                        {this.Accord()}

                    </Grid>

                    <Grid item>

                        {this.Dgrid()}
                        
                    </Grid>

                </Grid>
                </div>
            
            </div>
        );
    }
}

export default withStyles(useStyles)(App);