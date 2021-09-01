import React, { useState, Component } from 'react';
import { Grid, Paper, TextField, Typography, Button, Toolbar, Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { DataGrid } from '@material-ui/data-grid';
import { ExpandMore } from '@material-ui/icons';

import * as gpm from './gpm';
import Header from './Header';

const tf = require('@tensorflow/tfjs');

const width = 133;
const columns = [
    { field: 'id' },
    { field: 'index', width },
    { field: 'payoffs', width },
];

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
        tensor = tf.randomUniform(shape, 0, 9, 'int32');
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
            tensor: [],
        };
    }

    onClick = () => {
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
    }

    Dgrid() {
        const { rows, loading } = this.state;
        const data = { rows, columns, loading, autoHeight: true }
        return <DataGrid {...data} />;
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
                                    Generate Random Matrix:
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

                        {this.Dgrid()}
                        
                    </Grid>

                    <Grid item xs>
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
                    </Grid>

                </Grid>
                </div>
            
            </div>
        );
    }
}

export default withStyles(useStyles)(App);