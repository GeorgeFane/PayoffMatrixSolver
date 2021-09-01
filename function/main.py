import itertools
from collections import Counter
import json

import numpy as np

def main(values):
    a = np.array(values)
    print(a)

    shape = a.shape
    s, p = shape[0], shape[-1]

    cords = np.array(
        list(    
            itertools.product(
                np.arange(s), repeat=p-1
            )
        )
    ) 
    locals = []
    for i in range(p):
        b = a.swapaxes(i, p).take(i, axis=i)

        for cord in cords:
            copy = cord.copy()
            
            locals.append(
                tuple(
                    np.insert(copy, i, b[cord].argmax()).tolist()
                )
            )

    freqs = Counter(locals)
    opts = [x for x, y in freqs.items() if y == p]

    rtn = [
        [opt, a[opt].tolist()]
        for opt in opts
    ]
    print(json.dumps(rtn))
    return rtn

def pmsolver(request):
    # For more information about CORS and CORS preflight requests, see:
    # https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request

    # Set CORS headers for the preflight request
    if request.method == 'OPTIONS':
        # Allows GET requests from any origin with the Content-Type
        # header and caches preflight response for an 3600s
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }

        return ('', 204, headers)

    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': '*'
    }

    print(request)
    return ({ 'data': main(request.get_json()['data']) }, 200, headers)

main( [[[6, 5], [0, 1]], [[4, 4], [1, 0]]] )
