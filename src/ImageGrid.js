import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { TextField, Box, Grid, Toolbar, Tooltip, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
}));

export default function SimpleAccordion(props) {
    const classes = useStyles();

    const items = props.rows
        .filter(tile => tile.Poster !== 'N/A')
        .map(tile => (
            <Grid
                item
                onClick={() => props.onClick(tile.imdbID)}
            >
                <img
                    src={tile.Poster}
                    alt={tile.Title}
                    width={144}
                />
            </Grid>
        ));

    return (        
        <Grid container justify='left' spacing={2}>
            {items}
        </Grid>
    );

    return (
        <div className={classes.root}>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography className={classes.heading}>
                        Search Results
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container justify='left' spacing={2}>
                        {items}
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}
