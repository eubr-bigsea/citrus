/*
    const anchorsOriginal = {
        input: [
            [
                [0.5, 0, 0, -1],
            ],
            [
                [0.2, 0, 0, -1],
                [0.8, 0, 0, -1]
            ],
            [
                [0.2, 0, 0, -1],
                [0.5, 0, 0, -1],
                [0.8, 0, 0, -1]
            ]
        ],
        output: [
            [
                [0.5, 1, 0, 1],
            ],
            [
                [0.2, 1, 0, 1],
                [0.8, 1, 0, 1]
            ],
            [
                [0.2, 1, 0, 1],
                [0.5, 1, 0, 1],
                [0.8, 1, 0, 1]
            ]
        ]
    }
    */
const anchors = {
    input: [
        [
            [0, 0.5, -1, 0],
        ],
        [
            [0, 0.2, -1, 0],
            [0, 0.8, -1, 0]
        ],
        [
            [0, 0.1, -1, 0],
            [0, 0.5, -1, 0],
            [0, 0.9, -1, 0]
        ]
        ,
        [
            [0, .1, -1, 0],
            [0, 0.39, -1, 0],
            [0, 0.65, -1, 0],
            [0, .9, -1, 0]
        ],
    ],
    output: [
        [
            [1, 0.5, 1, 0],
        ],
        [
            [1, 0.2, 1, 0],
            [1, 0.8, 1, 0]
        ],
        [
            [1, 0.1, 1, 0],
            [1, 0.5, 1, 0],
            [1, 0.9, 1, 0]
        ],
        [
            [1, .1, 1, 0],
            [1, 0.39, 1, 0],
            [1, 0.65, 1, 0],
            [1, .9, 1, 0]
        ],
    ]
};
const connectorType = ['Flowchart', 'Bezier', 'StateMachine'][0];
const connectorPaintStyle = {
    lineWidth: 1,
    radius: 8,
    strokeStyle: "#111",
    stroke: "#111",
    outlineColor: 'white',
    outlineWidth: 2,
};

const endPointPaintStyle = {
    fillStyle: 'rgba(102, 155, 188, 1)',
    radius: 8,
    height: 15,
    width: 15,
    zIndex: 99,
};
const overlays = [
    ["Arrow", { location: .85, width: 10, length: 15 }],
    /*
    ["Label", { padding: 10, location: .5, 
        label: '[ <font-awesome-icon icon="fa fa-dot-circle-o" /> ]', 
        cssClass: "labelClass" }]
        */
];


const endPointOptionsInput = {
    isSource: false,
    isTarget: true,
    cssClass: 'endpoint',
    paintStyle: endPointPaintStyle,
    connectorOverlays: overlays,
    endpoint: "Dot",
    maxConnections: 1,
    fill: '#222'
};

const endPointOptionsOutput = {
    connector: [connectorType, { gap: 0, xproximityLimit: 100, curviness: 75, 
        xmargin: 10, cornerRadius: 5, stub: [20, 20], midpoint: .5 },],
    isSource: true,
    isTarget: false,
    cssClass: 'endpoint',
    paintStyle: endPointPaintStyle,
    connectorOverlays: overlays,
    endpoint: "Rectangle",
    maxConnections: 1,
    connectorStyle: connectorPaintStyle,
    fill: '#faa'
};
/*
const connectionOptions = {
    maxConnections: 1,
    endpoint: ['Dot', connectorPaintStyle],
    paintStyle: connectorPaintStyle,
    overlays: overlays,
}
*/
export {anchors, endPointOptionsInput, endPointOptionsOutput };