import Link from "next/link";
import Head from "../components/head";
import Preview from "../components/preview";

let synth = {
    vanityText: "OKAY",
    keyCount: 25,
    startingNoteIndex: 0,
    color: "#ff0000"
};

export default () => (
    <div>
        <Head title="build.oskitone" />

        <Preview model={synth} />

        <style jsx>{`
            :global(*) {
                padding: 0;
                margin: 0;
            }
            :global(body) {
                font-family: -apple-system, BlinkMacSystemFont, Avenir Next,
                    Avenir, Helvetica, sans-serif;
            }
        `}</style>
    </div>
);
