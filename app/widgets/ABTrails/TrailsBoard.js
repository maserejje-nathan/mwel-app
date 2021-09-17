import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, PanResponder, StyleSheet, Image } from 'react-native';
import Svg, { Polyline, Circle, Text } from 'react-native-svg';
import ReactDOMServer from 'react-dom/server';

const styles = StyleSheet.create({
  picture: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  blank: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    borderWidth: 1,
    borderColor: '#d6d7da',
  },
});

function chunkedPointStr(lines, chunkSize) {
  const results = [];
  lines.forEach((line) => {
    const { length } = line.points;
    for (let index = 0; index < length; index += chunkSize) {
      const myChunk = line.points.slice(index, index + chunkSize + 1);
      // Do something if you want with the group
      results.push(myChunk.map(point => `${point.x},${point.y}`).join(' '));
    }
  });
  return results;
}

export default class TrailsBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lines: [],
      incorrectPoints: [],
      currentIndex: 1,
      isValid: false,
    };
    this.allowed = false;
    this.startX = 0;
    this.startY = 0;
    this.lastX = 0;
    this.lastY = 0;
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => {
        this.props.onPress();
        return true;
      },
      onPanResponderGrant: this.startLine,
      onPanResponderMove: this.movePoint,
      onPanResponderRelease: (evt, gestureState) => {
        this.props.onRelease();
        this.releaseLine(evt, gestureState);
      },
    });
    this.allowed = true;
  }

  componentDidMount() {
    const { currentIndex } = this.props;
  
    console.log('************************', this.props);
    this.setState({ currentIndex });
  }

  startLine = (evt) => {
    const { screen } = this.props;
    const { lines } = this.state;
    if (!this.allowed) return;
    const { locationX, locationY } = evt.nativeEvent;
    let isValid = false;
    let order = 0;

    this.props.onError();
    screen.items.forEach((item) => {
      const distance = Math.sqrt(Math.pow(item.cx - locationX, 2) + Math.pow(item.cy - locationY, 2));

      if (distance <= screen.r) {
        this.startX = item.cx;
        this.startY = item.cy;
        order = item.order;
        isValid = true;
      }
    });
    
    this.setState({ isValid });
    if (isValid) {
      const newLine = { points: [{ x: this.startX, y: this.startY, time: Date.now(), order }] };
      this.setState({ lines: [...lines, newLine] });
    }
  }

  movePoint = (evt, gestureState) => {
    const { lines, isValid } = this.state;
    if (!this.allowed || lines.length === 0) return;

    const time = Date.now();
    const n = lines.length - 1;
    const { moveX, moveY, x0, y0 } = gestureState;

    if (isValid) {
      this.lastX = moveX - x0 + this.startX;
      this.lastY = moveY - y0 + this.startY;
      this.lastPressTimestamp = time;
      if (lines[n].points.length > 1) {
        lines[n].points.pop();
      }
      lines[n].points.push({ x: this.lastX, y: this.lastY, time });
      this.setState({ lines });
    }
  }

  releaseLine = (evt, gestureState) => {
    const { screen } = this.props;
    const { lines, isValid, currentIndex } = this.state;
    if (!this.allowed || !lines.length || !isValid) return;

    const time = Date.now();
    const n = lines.length - 1;
    const { moveX, moveY, x0, y0 } = gestureState;
    let isValidPoint = false;
    let endOrder = 0;

    this.lastX = moveX - x0 + this.startX;
    this.lastY = moveY - y0 + this.startY;
    this.lastPressTimestamp = time;

    screen.items.forEach(({ cx, cy, order }) => {
      const distance = Math.sqrt(Math.pow(cx - this.lastX, 2) + Math.pow(cy - this.lastY, 2));
      if (distance <= screen.r) {
        this.lastX = cx;
        this.lastY = cy;
        endOrder = order;
        isValidPoint = true;
      }
    });

    if (lines[n].points.length > 1) {
      lines[n].points.pop();
    }
    
    if (lines[n].points[0].order !== currentIndex || endOrder !== currentIndex + 1) {
      let incorrectPoints = [];

      if (lines[n].points[0].order !== currentIndex) incorrectPoints.push(lines[n].points[0].order);
      if (endOrder !== currentIndex + 1) incorrectPoints.push(endOrder);

      isValidPoint = false;
      this.setState({ incorrectPoints });
      this.props.onError("Incorrect line!");
    } else {
      this.setState({ incorrectPoints: [] });
    }

    if (isValidPoint) {
      lines[n].points.push({ x: this.lastX, y: this.lastY, time, order: endOrder });

      const result = this.save(lines, endOrder);
      this.props.onResult({ ...result });
      this.setState({ lines, currentIndex: endOrder });
    } else {
      this.setState({ isValid: false });
    }
  }

  onLayout = (event) => {
    if (this.state.dimensions) return; // layout was already called
    const { width, height, top, left } = event.nativeEvent.layout;
    if (this.props.lines && this.props.lines.length > this.state.lines.length) {
      const lines = this.props.lines.map(line => ({
        ...line,
        points: line.points.map(point => ({
          ...point,
          x: point.x * width / 100,
          y: point.y * width / 100,
        })),
      }));
      this.setState({ dimensions: { width, height, top, left }, lines });
    } else {
      this.setState({ dimensions: { width, height, top, left } });
    }
  }

  reset = () => {
    this.setState({ lines: [] });
  }

  start = () => {
    this.reset();
    this.allowed = true;
  }

  stop = () => {
    this.allowed = false;
  }

  save = (lines, currentIndex) => {
    const { width } = this.state.dimensions;
    const results = lines.map(line => ({
      ...line,
      points: line.points.map(point => ({
        ...point,
        x: point.x / width * 100,
        y: point.y / width * 100,
      })),
    }));

    return { lines: results, currentIndex };
  }

  renderLine = (pointStr, idx) => (
    <Polyline
      key={idx}
      points={pointStr}
      fill="none"
      stroke="black"
      strokeWidth="1.5"
    />
  );

  renderTrailsData = (item, index, trailsData) => {
    const { screen } = this.props;
    const { currentIndex, incorrectPoints } = this.state;
    let itemColor = trailsData.colors.pending;

    if (incorrectPoints.includes(index + 1)) {
      itemColor = trailsData.colors.failed;
    } else if (index < currentIndex) {
      itemColor = trailsData.colors.passed;
    }

    return (
      <>
        <Circle
          fill="white"
          stroke={itemColor}
          strokeWidth="1.2"
          cx={item.cx}
          cy={item.cy}
          r={trailsData.r}
        />

        <Text
          stroke={itemColor}
          fontSize="22"
          fontWeight="bold"
          x={item.cx}
          y={item.cy + 7}
          textAnchor="middle"
        >
          {item.label}
        </Text>

        {index === 0 && <Text
          stroke={trailsData.colors.pending}
          fontSize="12"
          fontWeight="200"
          x={item.cx}
          y={item.cy - 20}
          textAnchor="middle"
        >
          {`Begin`}
        </Text>}

        {index === screen.items.length - 1 && <Text
          fill="white"
          stroke={trailsData.colors.pending}
          fontSize="12"
          fontWeight="200"
          x={item.cx}
          y={item.cy - 20}
          textAnchor="middle"
        >
          {`End`}
        </Text>}
      </>
    )
  }

  // childToWeb = (child) => {
  //   const { type, props } = child;
  //   const name = type && (type.displayName || type.name);
  //   const Tag = name && name[0].toLowerCase() + name.slice(1);

  //   console.log('props', props)
  //   return <Tag {...props}>{this.toWeb(props.children)}</Tag>;
  // };

  // toWeb = children => React.Children.map(children, this.childToWeb);

  // serialize = () => {
  //   const element = this.renderSvg();
  //   console.log('elements-------------', element);
  //   const webJsx = this.toWeb(element);
  //   console.log('webJSX=============', webJsx)
  //   return ReactDOMServer.renderToStaticMarkup(webJsx);
  // };

  renderSvg() {
    const { lines, dimensions } = this.state;
    const { screen } = this.props;
    const width = dimensions ? dimensions.width : 300;
    const strArray = chunkedPointStr(lines, 50);
    return (
      <Svg
        ref={(ref) => { this.svgRef = ref; }}
        height={width}
        width={width}
      >
        {strArray.map(this.renderLine)}
        {screen.items.map((item, index) => this.renderTrailsData(item, index, screen))}
      </Svg>
    );
  }

  render() {
    const { dimensions } = this.state;
    const width = dimensions ? dimensions.width : 300;
    return (
      <View
        style={{
          width: '100%',
          height: width || 300,
          alignItems: 'center',
          backgroundColor: 'white',
        }}
        onLayout={this.onLayout}
        {...this._panResponder.panHandlers}
      >
        {this.props.imageSource && (
          <Image
            style={styles.picture}
            source={{ uri: this.props.imageSource }}
          />
        )}
        <View style={styles.blank}>
          {dimensions && this.renderSvg()}
        </View>
      </View>
    );
  }
}

TrailsBoard.defaultProps = {
  imageSource: null,
  lines: [],
  currentIndex: 1,
  onResult: () => {},
  onPress: () => {},
  onRelease: () => {},
};

TrailsBoard.propTypes = {
  imageSource: PropTypes.string,
  lines: PropTypes.array,
  screen: PropTypes.object,
  currentIndex: PropTypes.number,
  onResult: PropTypes.func,
  onPress: PropTypes.func,
  onError: PropTypes.func,
  onRelease: PropTypes.func,
};
