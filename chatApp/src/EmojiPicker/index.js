import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import CategoriesNav from './components/CategoriesNav';
import EmojiList from './components/EmojiList';
import RecentlyUsed from './components/RecentlyUsed';
import Search from './components/Search';
import VariationsMenu from './components/VariationsMenu';
import useKeyboardNavigation from './hooks/useKeyboardNavigation';
import clickHandler from './lib/clickHandler';
import { GROUP_NAMES_ENGLISH, DEFAULT_EMOJI_URL } from './lib/constants';
import { configPropTypes, customEmojiPropTypes } from './lib/propTypes';
import {
  PickerContextProvider,
  useCloseVariationMenu,
  useCollapseSkinTones,
} from './PickerContext';

import {
  SKIN_TONE_DARK,
  SKIN_TONE_LIGHT,
  SKIN_TONE_MEDIUM,
  SKIN_TONE_MEDIUM_DARK,
  SKIN_TONE_MEDIUM_LIGHT,
  SKIN_TONE_NEUTRAL,
} from './components/SkinTones';
import activities from "./components/CategoriesNav/svg/activities.svg";
import smileys_people from "./components/CategoriesNav/svg/smileys_people.svg";
import animals_nature from "./components/CategoriesNav/svg/animals_nature.svg";
import flags from "./components/CategoriesNav/svg/flags.svg";
import food_drink from "./components/CategoriesNav/svg/food_drink.svg";
import objects from "./components/CategoriesNav/svg/objects.svg";
import symbols from "./components/CategoriesNav/svg/symbols.svg";
import travel_places from "./components/CategoriesNav/svg/travel_places.svg";
/**
 * @Todo: Remove Style.css
 */
// import './style.css';
import styled, {
  createGlobalStyle,
} from "styled-components";

const EmojiStyles = createGlobalStyle`
.emoji-picker-react .emoji-categories {
  padding: 0 15px;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  }
  .emoji-picker-react .emoji-categories button {
    height: 40px;
    width: 30px;
    padding: 5px 0;
    background-repeat: no-repeat;
    background-size: 20px;
    background-position: 50% 50%;
    cursor: pointer;
    opacity: 0.5;
    transition: opacity 0.1s;
  }

  .emoji-picker-react .emoji-categories button:focus-visible,
  .emoji-picker-react .emoji-categories button:focus:where(:not(.active)) {
    background-color: #99c2f160;
  }

  .emoji-picker-react .active-category-indicator-wrapper {
    position: relative;
    width: 100%;
  }

  .emoji-picker-react
    .active-category-indicator-wrapper
    .active-category-indicator {
    background: #99c2f1;
    height: 3px;
    width: 5px;
    position: absolute;
    bottom: 3px;
    border-radius: 5px;
    transition: 0.3s;
    width: 30px;
  }

  .emoji-picker-react .emoji-categories button.icn-activities {
    background-image: url('${activities}');
  }
  .emoji-picker-react .emoji-categories button.icn-animals_nature {
    background-image: url(${animals_nature});
  }
  .emoji-picker-react .emoji-categories button.icn-flags {
    background-image: url(${flags});
  }
  .emoji-picker-react .emoji-categories button.icn-food_drink {
    background-image: url(${food_drink});
  }
  .emoji-picker-react .emoji-categories button.icn-objects {
    background-image: url(${objects});
  }
  .emoji-picker-react .emoji-categories button.icn-smileys_people {
    background-image: url('${smileys_people}');
  }
  .emoji-picker-react .emoji-categories button.icn-symbols {
    background-image: url(${symbols});
  }
  .emoji-picker-react .emoji-categories button.icn-travel_places {
    background-image: url(${travel_places});
  }

  .emoji-picker-react .emoji-categories {
    padding: 0 15px;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
  }

  .emoji-picker-react .emoji-categories.inactive button,
  .emoji-picker-react .emoji-categories.inactive button.active,
  .emoji-picker-react .emoji-categories.inactive button:hover {
    opacity: 0.4;
    cursor: default;
  }

  .emoji-picker-react .emoji-categories button.active {
    opacity: 1;
  }

  .emoji-picker-react .emoji-categories button:hover {
    opacity: 0.7;
  }
  .emoji-picker-react .active-category-indicator-wrapper {
      position: relative;
      width: 100%;
  }
  .emoji-picker-react .active-category-indicator-wrapper .active-category-indicator {
      background: #99c2f1;
      height: 3px;
      width: 5px;
      position: absolute;
      bottom: 3px;
      border-radius: 5px;
      transition: .3s;
      width: 30px;
  }
  .emoji-picker-react input.emoji-search {
      width: calc(100% - 30px);
      margin-left: 15px;
      outline: none;
      box-shadow: none;
      padding: 10px;
      box-sizing: border-box;
      border: 1px solid #efefef;
      border-radius: 3px;
      transition: border .1s;
  }
  .emoji-picker-react div.skin-tones-list {
      padding: 0;
      margin: 0;
      list-style-type: none;
      position: absolute;
      top: 13px;
      right: 40px;
  }
  .emoji-picker-react div.skin-tones-list button#tneutral {
      color: #ffd225;
  }
  .emoji-picker-react div.skin-tones-list button {
      height: 10px;
      width: 10px;
      padding: 0;
      display: block;
  }
  .emoji-picker-react .content-wrapper-epr {
      flex: 1;
      overflow-y: hidden;
      position: relative;
  }
  .emoji-picker-react .content-wrapper-epr:before {
      content: attr(data-name);
      color: #aaa;
      font-size: 11px;
      display: block;
      position: absolute;
      right: 8%;
      z-index: 10;
      line-height: 45px;
      max-height: 45px;
      overflow: hidden;
      max-width: 100px;
      text-overflow: ellipsis;
      text-align: right;
  }
  .emoji-picker-react .emoji-scroll-wrapper {
      overflow-y: scroll;
      position: relative;
      height: 100%;
      box-sizing: border-box;
  }
  .emoji-picker-react .content-wrapper-epr:after {
        content: "";
      width: 100%;
      border-radius: 4px;
      position: absolute;
      top: 0;
      left: 0;
      box-shadow: 0 1px 14px rgb(0 0 0 / 20%);
  }
  .emoji-picker-react .emoji-group {
      clear: both;
      padding: 0 15px;
      list-style: none;
      margin: 0;
      display: flex;
      flex-flow: row wrap;
      justify-content: space-between;
  }
  .emoji-picker-react .emoji-group:before {
      content: attr(data-display-name);
      color: #aaa;
      font-size: 14px;
      position: sticky;
      background: rgba(255,255,255,.95);
      width: 100%;
      z-index: 1;
      top: 0;
      text-transform: uppercase;
      line-height: 45px;
      font-weight: 700;
  }
  .emoji-picker-react .emoji {
      position: relative;
  }
  .emoji-picker-react .emoji button {
      display: flex;
      justify-content: center;
      align-items: center;
      color: inherit;
      border-radius: 5px;
      transition: .1s background;
      padding: 0;
      margin: 0;
  }
  .emoji-picker-react img.emoji-img {
      height: 25px;
      width: 25px;
      margin: 5px;
  }
  .emoji-picker-react button {
      border: none;
      cursor: pointer;
      outline: none;
      background: none;
  }
`;

const InlineEmojiPicker = styled.div`
  box-sizing: border-box;
  position: absolute !important;
  border: 1px solid #f1f1f1;
  border-radius: 6px;
  background: white;
  bottom: 86px;
  left: 63px;
  z-index: 9999;
  right: unset !important;
  box-shadow: 0 3px 14px rgb(44 48 64 / 25%);
  background: #fff;
  display: flex;
  flex-direction: column;
  height: 320px;
  width: 280px;
  font-family: sans-serif;
  &:after {
    content: "";
    width: 100%;
    border-radius: 4px;
    position: absolute;
    top: 0;
    left: 0;
    box-shadow: 0 1px 14px rgba(0, 0, 0, 0.2);
  }
  &:before {
    content: "";
    width: 16px;
    top: calc(100% - 36px);
    left: -8px;
    height: 16px;
    transform: rotate(45deg);
    background: #fff;
    position: absolute;
    z-index: 998;
  }
`;

const EmojiPicker = ({
  emojiUrl = DEFAULT_EMOJI_URL,
  onEmojiClick,
  preload = false,
  native = false,
  skinTone = SKIN_TONE_NEUTRAL,
  disableAutoFocus = false,
  disableSearchBar = false,
  disableSkinTonePicker = false,
  groupNames = {},
  groupVisibility = {},
  ...props
}) => {
  const onClickRef = useRef(onEmojiClick);

  onClickRef.current = onEmojiClick;

  return (
    <PickerContextProvider
      config={{
        skinTone,
        emojiUrl,
        preload,
        native,
        groupNames: Object.assign(GROUP_NAMES_ENGLISH, groupNames),
        groupVisibility,
        disableSearchBar,
        disableAutoFocus,
        disableSkinTonePicker,
      }}
      onEmojiClick={clickHandler(onClickRef)}
    >
      <EmojiStyles />
      <EmojiPickerContent {...props} />
    </PickerContextProvider>
  );
};

const EmojiPickerContent = ({ pickerStyle = {}, searchPlaceholder = null }) => {
  const emojiPickerRef = useRef(null);
  const emojiListRef = useRef(null);
  const emojiSearchRef = useRef(null);
  const skinToneSpreadRef = useRef(null);
  const categoriesNavRef = useRef(null);

  useKeyboardNavigation({
    categoriesNavRef,
    emojiSearchRef,
    emojiListRef,
    skinToneSpreadRef,
  });

  return (
    <Aside
      pickerStyle={pickerStyle}
      emojiPickerAsideRef={emojiPickerRef}
      skinToneSpreadRef={skinToneSpreadRef}
    >
      <CategoriesNav
        emojiListRef={emojiListRef}
        categoriesNavRef={categoriesNavRef}
      />
      <Search
        searchPlaceholder={searchPlaceholder}
        emojiSearchRef={emojiSearchRef}
        skinToneSpreadRef={skinToneSpreadRef}
      />

      <div className="content-wrapper-epr">
        <VariationsMenu />
        <section className="emoji-scroll-wrapper" ref={emojiListRef}>
          <RecentlyUsed emojiListRef={emojiListRef} />
          <EmojiList emojiListRef={emojiListRef} />
        </section>
      </div>
    </Aside>
  );
};

function Aside({
  children,
  pickerStyle,
  emojiPickerAsideRef,
  skinToneSpreadRef,
}) {
  const closeVariations = useCloseVariationMenu();
  const collapseSkinTones = useCollapseSkinTones();
  return (
    <InlineEmojiPicker
      className="emoji-picker-react"
      style={pickerStyle}
      onScroll={() => {
        closeVariations();
        collapseSkinTones();
      }}
      onMouseDown={e => {
        closeVariations();

        if (!skinToneSpreadRef.current.contains(e.target)) {
          collapseSkinTones();
        }
      }}
      ref={emojiPickerAsideRef}
    >
      {children}
    </InlineEmojiPicker>
  );
}

Aside.propTypes = {
  children: PropTypes.node,
  pickerStyle: PropTypes.object,
  emojiPickerAsideRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }),
  skinToneSpreadRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }),
};

EmojiPickerContent.propTypes = {
  pickerStyle: PropTypes.objectOf(PropTypes.string),
  searchPlaceholder: PropTypes.string,
};

export {
  SKIN_TONE_NEUTRAL,
  SKIN_TONE_LIGHT,
  SKIN_TONE_MEDIUM_LIGHT,
  SKIN_TONE_MEDIUM,
  SKIN_TONE_MEDIUM_DARK,
  SKIN_TONE_DARK,
};

export default EmojiPicker;

EmojiPicker.propTypes = {
  onEmojiClick: PropTypes.func,
  pickerStyle: PropTypes.objectOf(PropTypes.string),
  ...customEmojiPropTypes,
  ...configPropTypes,
};
