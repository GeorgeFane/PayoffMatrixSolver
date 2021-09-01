const tf = require('@tensorflow/tfjs');

const range = value => tf.linspace(0, value - 1, value)
const cartesian = (...a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));

function solve(players, strats) {
    const shape = new Array(players).fill(strats).concat(players)
    const tensor = tf.randomUniform(shape, 0, players * Math.pow(strats, players), 'int32');
    tensor.print();

    const inputs = new Array(players - 1).fill( range(strats).arraySync() )
    let cords = cartesian(...inputs)
    // console.log(cords)

    var locals = [];
    for (let i = 0; i < players; i++) {
        const amax = tensor.argMax(i)

        for (const cord1 of cords) {
            var cord = players > 2 ? [...cord1] : [cord1];
            const multi = [...cord, i]

            const index = tf.gatherND(amax, multi).dataSync()[0]
            if (i === players - 1) {
                cord.push(index)
            }
            else {
                cord.splice(i, 0, index)
            }
            locals.push(cord)
        }
    }

    const arr = locals.map(local => JSON.stringify(local))
    const counts = {};

    for (const num of arr) {
        counts[num] = counts[num] ? counts[num] + 1 : 1;
    }

    const indexes = Object.keys(counts).filter( index => counts[index] === players );

    const answers = indexes.map( (index, id) => {
        const values = tf.gatherND(
            tensor, JSON.parse(index)
        ).arraySync()
        const payoffs = JSON.stringify(values);
        // const payoffs = values.map( (payoff, player) => (
        //     'Player ' + player + ': ' + payoff
        // ) ).join(', ');
        return { id, index, payoffs };
    })
    return answers;
}

// console.log(solve(2, 2), '\n')
export { solve };