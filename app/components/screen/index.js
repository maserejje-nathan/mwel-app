import React, { Component } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import ScreenDisplay from './ScreenDisplay';
import WidgetError from './WidgetError';
import {
  AudioImageRecord,
  AudioRecord,
  AudioStimulus,
  DatePicker,
  MultiSelect,
  Radio,
  Select,
  Slider,
  TextEntry,
  TimeRange,
  VisualStimulusResponse,
  Drawing,
  Camera,
  TableInput,
} from '../../widgets';

const styles = StyleSheet.create({
  content: {
    flexDirection: 'column',
  },
  padding: {
    padding: 20,
  },
  paddingContent: {
    padding: 20,
    flex: 1,
    position: 'relative',
  },
  text: {
    paddingTop: 20,
    paddingBottom: 20,
  },
});

class Screen extends Component {
  static isValid(answer, screen) {
    if (screen.inputType === 'markdown-message') {
      return true;
    }
    return (answer !== null && typeof answer !== 'undefined');
  }

  constructor() {
    super();
    this.state = {
      scrollEnabled: true,
    };
  }

  renderWidget() {
    const { screen, answer, onChange, isCurrent } = this.props;

    if (screen.inputType === 'radio'
      && R.path(['valueConstraints', 'multipleChoice'], screen) === true) {
      return (
        <MultiSelect
          config={screen.valueConstraints}
          onChange={onChange}
          value={answer}
        />
      );
    }
    if (screen.inputType === 'radio'
      && R.path(['valueConstraints', 'itemList'], screen)) {
      return (
        <Radio
          config={screen.valueConstraints}
          onChange={onChange}
          value={answer}
        />
      );
    }
    if (screen.inputType === 'slider') {
      return (
        <Slider
          config={screen.valueConstraints}
          onChange={onChange}
          onPress={() => this.setState({ scrollEnabled: false })}
          onRelease={() => this.setState({ scrollEnabled: true })}
          value={answer}
        />
      );
    }
    if (screen.inputType === 'timeRange') {
      return (
        <TimeRange
          onChange={onChange}
          value={answer}
        />
      );
    }
    if (screen.inputType === 'date') {
      return (
        <DatePicker
          onChange={onChange}
          value={answer}
        />
      );
    }
    if (screen.inputType === 'select'
      && R.path(['valueConstraints', 'itemList'], screen)) {
      return (
        <Select
          onChange={onChange}
          value={answer}
          config={screen.valueConstraints}
        />
      );
    }
    if (screen.inputType === 'text') {
      return (
        <TextEntry
          onChange={onChange}
          value={answer}
        />
      );
    }
    if (screen.inputType === 'audioRecord' || screen.inputType === 'audioPassageRecord') {
      return (
        <AudioRecord
          onChange={onChange}
          config={screen.valueConstraints}
          value={answer}
        />
      );
    }
    if (screen.inputType === 'audioImageRecord'
      && R.path(['valueConstraints', 'image'], screen)) {
      return (
        <AudioImageRecord
          onChange={onChange}
          config={screen.valueConstraints}
          value={answer}
        />
      );
    }
    if (screen.inputType === 'audioStimulus') {
      return (
        <AudioStimulus
          value={answer}
          onChange={onChange}
          config={screen.inputs}
          isCurrent={isCurrent}
        />
      );
    }
    if (screen.inputType === 'photo') {
      return (
        <Camera
          value={answer}
          onChange={onChange}
        />
      );
    }
    if (screen.inputType === 'video') {
      return (
        <Camera
          value={answer}
          onChange={onChange}
          video
        />
      );
    }
    if (screen.inputType === 'visual-stimulus-response') {
      return (
        <VisualStimulusResponse
          onChange={onChange}
          config={screen.inputs}
          isCurrent={isCurrent}
        />
      );
    }
    if (screen.inputType === 'drawing') {
      return (
        <Drawing
          config={screen.inputs}
          onChange={onChange}
          onPress={() => this.setState({ scrollEnabled: false })}
          onRelease={() => this.setState({ scrollEnabled: true })}
          value={answer}
        />
      );
    }
    if (screen.inputType === 'tableCounter') {
      return (
        <TableInput
          config={screen.inputs}
          onChange={onChange}
          value={answer}
        />
      );
    }
    if (screen.inputType === 'tableText') {
      return (
        <TableInput
          config={screen.inputs}
          onChange={onChange}
          value={answer}
          freeEntry
        />
      );
    }
    if (screen.inputType === 'markdown-message') {
      return null;
    }
    return <WidgetError />;
  }

  render() {
    const { screen } = this.props;
    const { scrollEnabled } = this.state;
    return (
      <ScrollView
        alwaysBounceVertical={false}
        style={styles.paddingContent}
        contentContainerStyle={{ paddingBottom: 20, minHeight: '100%' }}
        scrollEnabled={scrollEnabled}
      >
        <ScreenDisplay screen={screen} />
        {this.renderWidget()}
      </ScrollView>
    );
  }
}

Screen.defaultProps = {
  answer: undefined,
};

Screen.propTypes = {
  screen: PropTypes.object.isRequired,
  answer: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  isCurrent: PropTypes.bool.isRequired,
};

export default Screen;
