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
// anchors only has hand-tuned rows for 1-4 ports; beyond that, fall
// back to evenly-spaced positions with the same 0.1 margin the
// 3-port row already uses, instead of throwing on undefined.
function anchorRow(portType, portCount) {
    const table = anchors[portType];
    if (portCount <= table.length) return table[portCount - 1];
    const x = portType === 'input' ? 0 : 1;
    const dx = portType === 'input' ? -1 : 1;
    const margin = 0.1;
    const step = (1 - 2 * margin) / (portCount - 1);
    return Array.from({ length: portCount },
        (_, i) => [x, margin + i * step, dx, 0]);
}

const connectorType = ['Flowchart', 'Bezier', 'StateMachine'][0];
const connectorPaintStyle = {
    strokeWidth: 1,
    radius: 8,
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
export {anchors, anchorRow, endPointOptionsInput, endPointOptionsOutput };