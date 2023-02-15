const Image = (props) => {
  return (
    <img
      src={props.src}
      className="liveConv_image"
      alt={props.src}
      onClick={props.HandleClickImage}
    />
  );
};

export default Image;
