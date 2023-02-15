const Document = (props) => {
    return (
        <a href={props.message.text} className="liveConv_document" target="_blank">Document</a>
    );
};

export default Document;