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
    AQUA_BLUE_DARK: "#00A8FF",
    HOT_PINK: "#FF4474",
    APPLE_GREEN: "#5AFF54"
};

const HARDWARE = {
    KNOB_DIAMETER: 22.4
};

const AUDIO_OUT = {
    NONE: 0,
    QUARTER_INCH: 1
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

const MODEL = {
    OKAY: 0,
    OKAY_2: 1,
    CUSTOM: 2
};

let MODEL_DEFAULTS = {};
MODEL_DEFAULTS[MODEL.OKAY] = {
    keyCount: 8,
    startingNoteIndex: 0,
    speakerDiameter: 49.8,
    audioOut: AUDIO_OUT.NONE,
    knobsCount: 2,
    controlPosition: POSITION.RIGHT
};
MODEL_DEFAULTS[MODEL.OKAY_2] = {
    keyCount: 15,
    startingNoteIndex: 0,
    speakerDiameter: 49.8,
    audioOut: AUDIO_OUT.QUARTER_INCH,
    knobsCount: 2,
    controlPosition: POSITION.BACK
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

module.exports = {
    AUDIO_OUT,
    COLOR,
    CONTROL,
    ENCLOSURE,
    HARDWARE,
    KEY,
    LABEL,
    MODEL,
    MODEL_DEFAULTS,
    OSKITONE,
    POSITION
};
