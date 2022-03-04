export default {
    global: {
        sideBorders: 8,
        tabSetHeaderHeight: 26,
        tabSetTabStripHeight: 26,
        enableEdgeDock: false,
        borderBarSize: 0,
    },
    layout: {
        type: "tabset",
        weight: 100,
        id: "root",
        children: [
            {
                type: "row",
                weight: 70,
                children: [
                    {
                        type: "tabset",
                        weight: 100,
                        id: "leftPanel",
                        enableDeleteWhenEmpty: false,
                        children: []
                    }
                ]
            },
            {
                type: "row",
                weight: 30,
                children: [
                    {
                        type: "tabset",
                        weight: 100,
                        id: "rightPanel",
                        enableDeleteWhenEmpty: false,
                        children: []
                    }
                ]
            }
        ]
    }
};