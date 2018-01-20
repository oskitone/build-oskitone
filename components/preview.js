const Preview = props => (
    <div>
        <pre>{JSON.stringify(props.model, null, 4)}</pre>

        <style jsx>{`
            pre {
                background: #eee;
                color: #111;
                padding: 1rem;
            }
        `}</style>
    </div>
);

export default Preview;
