import React from 'react';
import PropTypes from 'prop-types';
import { getUserLocale } from 'get-user-locale';

import {
  getCenturyLabel,
  getDecadeLabel,
  getBeginNext,
  getBeginNext2,
  getBeginPrevious,
  getBeginPrevious2,
  getEndPrevious,
  getEndPrevious2,
} from '../shared/dates';
import {
  formatMonthYear as defaultFormatMonthYear,
  formatYear as defaultFormatYear,
} from '../shared/dateFormatter';
import { isView, isViews } from '../shared/propTypes';

const className = 'react-calendar__navigation';
import styled from "styled-components";

const CalendarNavigation = styled.div`
  height: auto;
  display: flex;
  align-items: center;
  margin: 24px 0 12px;
  font-family: inherit;
`;

const NavigationButton = styled.button`
    font-weight: 600;
    font-size: 13px;
    color: #000;
    font-family: inherit;
    height: 37px;
    min-width: 44px;
    background: none;
    margin: 0;
    border: 0;
    outline: none;
    &:hover, &:focus {
          background-color: rgb(230, 230, 230);
    }
`;

const CenterButton = styled.button`
  flex-grow: 1;
  font-family: inherit;
  min-width: 44px;
  background: none;
  &:hover, &:focus {
          background-color: rgb(230, 230, 230);
    }
`;

export default function Navigation({
  activeStartDate,
  drillUp,
  formatMonthYear = defaultFormatMonthYear,
  formatYear = defaultFormatYear,
  locale,
  maxDate,
  minDate,
  navigationAriaLabel = '',
  navigationAriaLive,
  navigationLabel,
  next2AriaLabel = '',
  next2Label = '»',
  nextAriaLabel = '',
  nextLabel = '›',
  prev2AriaLabel = '',
  prev2Label = '«',
  prevAriaLabel = '',
  prevLabel = '‹',
  setActiveStartDate,
  showDoubleView,
  view,
  views,
}) {
  const drillUpAvailable = views.indexOf(view) > 0;
  const shouldShowPrevNext2Buttons = view !== 'century';

  const previousActiveStartDate = getBeginPrevious(view, activeStartDate);
  const previousActiveStartDate2 =
    shouldShowPrevNext2Buttons && getBeginPrevious2(view, activeStartDate);
  const nextActiveStartDate = getBeginNext(view, activeStartDate);
  const nextActiveStartDate2 = shouldShowPrevNext2Buttons && getBeginNext2(view, activeStartDate);

  const prevButtonDisabled = (() => {
    if (previousActiveStartDate.getFullYear() < 0) {
      return true;
    }
    const previousActiveEndDate = getEndPrevious(view, activeStartDate);
    return minDate && minDate >= previousActiveEndDate;
  })();

  const prev2ButtonDisabled =
    shouldShowPrevNext2Buttons &&
    (() => {
      if (previousActiveStartDate2.getFullYear() < 0) {
        return true;
      }
      const previousActiveEndDate = getEndPrevious2(view, activeStartDate);
      return minDate && minDate >= previousActiveEndDate;
    })();

  const nextButtonDisabled = maxDate && maxDate < nextActiveStartDate;

  const next2ButtonDisabled =
    shouldShowPrevNext2Buttons && maxDate && maxDate < nextActiveStartDate2;

  function onClickPrevious() {
    setActiveStartDate(previousActiveStartDate, 'prev');
  }

  function onClickPrevious2() {
    setActiveStartDate(previousActiveStartDate2, 'prev2');
  }

  function onClickNext() {
    setActiveStartDate(nextActiveStartDate, 'next');
  }

  function onClickNext2() {
    setActiveStartDate(nextActiveStartDate2, 'next2');
  }

  function renderLabel(date) {
    const label = (() => {
      switch (view) {
        case 'century':
          return getCenturyLabel(locale, formatYear, date);
        case 'decade':
          return getDecadeLabel(locale, formatYear, date);
        case 'year':
          return formatYear(locale, date);
        case 'month':
          return formatMonthYear(locale, date);
        default:
          throw new Error(`Invalid view: ${view}.`);
      }
    })();

    return navigationLabel
      ? navigationLabel({
          date,
          label,
          locale: locale || getUserLocale(),
          view,
        })
      : label;
  }

  function renderButton() {
    const labelClassName = `${className}__label`;
    return (
      <CenterButton
        aria-label={navigationAriaLabel}
        aria-live={navigationAriaLive}
        className={labelClassName}
        disabled={!drillUpAvailable}
        onClick={drillUp}
        type="button"
      >
        <span className={`${labelClassName}__labelText ${labelClassName}__labelText--from`}>
          {renderLabel(activeStartDate)}
        </span>
        {showDoubleView && (
          <>
            <span className={`${labelClassName}__divider`}> – </span>
            <span className={`${labelClassName}__labelText ${labelClassName}__labelText--to`}>
              {renderLabel(nextActiveStartDate)}
            </span>
          </>
        )}
      </CenterButton>
    );
  }

  return (
    <CalendarNavigation>
      {/* {prev2Label !== null && shouldShowPrevNext2Buttons && (
        <button
          aria-label={prev2AriaLabel}
          className={`${className}__arrow ${className}__prev2-button`}
          disabled={prev2ButtonDisabled}
          onClick={onClickPrevious2}
          type="button"
        >
          {prev2Label}
        </button>
      )} */}
      {prevLabel !== null && (
        <NavigationButton
          aria-label={prevAriaLabel}
          className={`${className}__arrow ${className}__prev-button`}
          disabled={prevButtonDisabled}
          onClick={onClickPrevious}
          type="button"
        >
          {prevLabel}
        </NavigationButton>
      )}
      {renderButton()}
      {nextLabel !== null && (
        <NavigationButton
          aria-label={nextAriaLabel}
          className={`${className}__arrow ${className}__next-button`}
          disabled={nextButtonDisabled}
          onClick={onClickNext}
          type="button"
        >
          {nextLabel}
        </NavigationButton>
      )}
      {/* {next2Label !== null && shouldShowPrevNext2Buttons && (
        <button
          aria-label={next2AriaLabel}
          className={`${className}__arrow ${className}__next2-button`}
          disabled={next2ButtonDisabled}
          onClick={onClickNext2}
          type="button"
        >
          {next2Label}
        </button>
      )} */}
    </CalendarNavigation>
  );
}

Navigation.propTypes = {
  activeStartDate: PropTypes.instanceOf(Date).isRequired,
  drillUp: PropTypes.func.isRequired,
  formatMonthYear: PropTypes.func,
  formatYear: PropTypes.func,
  locale: PropTypes.string,
  maxDate: PropTypes.instanceOf(Date),
  minDate: PropTypes.instanceOf(Date),
  navigationAriaLabel: PropTypes.string,
  navigationAriaLive: PropTypes.string,
  navigationLabel: PropTypes.func,
  next2AriaLabel: PropTypes.string,
  next2Label: PropTypes.node,
  nextAriaLabel: PropTypes.string,
  nextLabel: PropTypes.node,
  prev2AriaLabel: PropTypes.string,
  prev2Label: PropTypes.node,
  prevAriaLabel: PropTypes.string,
  prevLabel: PropTypes.node,
  setActiveStartDate: PropTypes.func.isRequired,
  showDoubleView: PropTypes.bool,
  view: isView.isRequired,
  views: isViews.isRequired,
};
