const POSITION = {
    AUTO: 0,
    BACK: 1,
    LEFT: 2,
    RIGHT: 3
};

const COLOR = {
    STROKE: "#000",
    DARK: "#444",
    LIGHT: "#eee",
    AQUA_BLUE: "#63CAFF",
    HOT_PINK: "#FF4474",
    APPLE_GREEN: "#5AFF54"
};

const HARDWARE = {
    KNOB_DIAMETER: 22.4
};

const ENCLOSURE = {
    GUTTER: 5,
    RELATED_GUTTER: 2
};

const KEY = {
    WIDTH: 14.24,
    HEIGHT: 45.72,
    ACCIDENTAL_WIDTH: 7.62,
    ACCIDENTAL_HEIGHT: 22.86
};

const LABEL = {
    HEIGHT: 5
};

const CONTROL = {
    MINIMUM_HEIGHT:
        HARDWARE.KNOB_DIAMETER + ENCLOSURE.RELATED_GUTTER + LABEL.HEIGHT
};

const OSKITONE = {
    AVAILABLE_COLORS: [
        COLOR.AQUA_BLUE.toUpperCase(),
        COLOR.HOT_PINK.toUpperCase(),
        COLOR.APPLE_GREEN.toUpperCase()
    ],
    PRINTER: {
        BED_WIDTH: 250,
        BED_LENGTH: 210
    }
};

export { COLOR, CONTROL, ENCLOSURE, HARDWARE, KEY, LABEL, OSKITONE, POSITION };
