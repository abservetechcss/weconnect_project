import styled from "styled-components";
const StyledVideo = styled.video`
border-radius: 8px;
max-height: 180px;
max-width: 200px;
width: 200%;
`;
const VideoPlayer = (props) => {
  console.log("video", props);
      return (
        <StyledVideo controls>
          <source src={props.src} />
        </StyledVideo>
      );
  };

  export default VideoPlayer;