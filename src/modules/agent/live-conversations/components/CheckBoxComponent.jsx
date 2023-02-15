import Checkbox from '@mui/material/Checkbox';

const CheckedIcon = ({ fill }) => (<svg style={{
    display: 'inline-block',
  fill: fill,
  lineHeight: 1,
  stroke: fill,
  strokeWidth: 0}} id="Group_1178" data-name="Group 1178" xmlns="http://www.w3.org/2000/svg" width="15.932" height="14.8" viewBox="0 0 15.932 14.8">
  <g id="check-square" transform="translate(1 1)">
    <path id="Path_48097" data-name="Path 48097" d="M9,8.978l2.134,2.133L18.249,4" transform="translate(-4.731 -3.289)" fill="none" stroke="#5ac593" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
    <path id="Path_48098" data-name="Path 48098" d="M15.806,9.4v4.978A1.423,1.423,0,0,1,14.383,15.8H4.423A1.423,1.423,0,0,1,3,14.378V4.422A1.423,1.423,0,0,1,4.423,3h7.826" transform="translate(-3 -3)" fill="none" stroke="#5ac593" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
  </g>
</svg>);

export default function IconCheckbox(props) {
  return (
    <Checkbox {...props} style={ {padding: "9px"}} checkedIcon={<CheckedIcon />} />
  );
}