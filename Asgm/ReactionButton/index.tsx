import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  LayoutRectangle,
  Dimensions,
} from 'react-native';
import { isNumber } from './helpers';
import ReactionImage from './ReactionImage';
import {
  ReactionButtonComponentBase,
  ReactionButtonComponentProps,
  ReactionButtonComponentState,
  ReactionItem,
} from './types';

const PADDING_SIZE = 10;

class ReactionButton extends React.Component<ReactionButtonComponentProps, ReactionButtonComponentState> {
  state: ReactionButtonComponentState = {
    visible: false,
    selectedIndex: -1,
    lastPressIn: 0,
  };

  static defaultProps: ReactionButtonComponentBase = {
    reactionSize: 40,
    reactionSmallSize: 20,
    debug: false,
    textProps: {},
    hitSlop: {
      top: 10,
      left: 10,
      right: 10,
      bottom: 10,
    },
  };

  private _opacityAnim: Animated.Value = new Animated.Value(0);

  private _buttonLayout: LayoutRectangle = {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  };
  private _reactionButtonRef: { current: any } = React.createRef();

  private _screenWidth: number = Dimensions.get('window').width;
  private _screenHeight: number = Dimensions.get('window').height;

  private _onPress = () => {
    if (isNumber(this.props.defaultIndex)) {
      this.props.onChange(this.state.selectedIndex >= 0 ? this.state.selectedIndex : this.props.defaultIndex!);
    } else {
      this._showReactions();
    }
  };

  private _onLongPress = () => {
    this._showReactions();
  };

  private _showReactions = () => {
    if (this.state.visible) {
      this._debug('_showReactions', 'reactions already visible in screen');
      return;
    }

    this.setState({ visible: true }, () => {
      Animated.timing(this._opacityAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  };

  private _onPressIn = () => this.setState({ lastPressIn: Date.now() });

  private _debug = (...args: any[]) => this.props.debug && console.log(...args);

  private _closeModalInternal = () => {
    this._debug('_closeModalInternal', this.state);
    this.setState({ visible: false });
  };
  private _closeModal = () => {
    this._debug('_closeModal');
    Animated.timing(this._opacityAnim, {
      toValue: 0,
      useNativeDriver: true,
      duration: 150,
    }).start(() => this._closeModalInternal());
  };

  private _renderReactionImage = (reaction: ReactionItem, index: number) => {
    const lastIndex = this.props.reactions.length - 1;
    return (
      <ReactionImage
        reaction={reaction}
        key={reaction.title}
        onPress={this._onReactionItemPress}
        styleImage={{
          width: this.props.reactionSize,
          height: this.props.reactionSize,
        }}
        style={{
          paddingRight: index <= lastIndex ? PADDING_SIZE : 0,
        }}
        index={index}
        renderImage={this.props.imageProps?.renderImage}
      />
    );
  };

  private _onReactionItemPress = (index: number) => {
    this._debug('_onReactionItemPress', index);
    this.props.onChange(index);
    this._closeModal();
  };

  private _getReactionsContainerLayout = (): { width: number; height: number } => {
    if (!this.props.reactionSize) {
      return { width: 0, height: 0 };
    }

    const total = this.props.reactions.length;

    return {
      width: total * this.props.reactionSize + (total - 1) * PADDING_SIZE + PADDING_SIZE * 2,
      height: this.props.reactionSize + PADDING_SIZE * 2,
    };
  };

  private _getReactionsPosition = (): { x: number; y: number } => {
    if (!this.state.visible) {
      return { x: 0, y: this._screenHeight };
    }

    let x = 0;
    const rcLayout = this._getReactionsContainerLayout();

    x = this._buttonLayout.x + this._buttonLayout.width / 2 - rcLayout.width / 2;
    if (x + rcLayout.width >= this._screenWidth) {
      x -= x + rcLayout.width - this._screenWidth + PADDING_SIZE;
    }

    return {
      x: Math.max(PADDING_SIZE, x),
      y: this._buttonLayout.y - this._buttonLayout.height - PADDING_SIZE * 2,
    };
  };

  private _measureButtonCallback = () => {
    this._reactionButtonRef.current.measure(
      (_x: number, _y: number, width: number, height: number, px: number, py: number) => {
        this._buttonLayout = {
          width,
          height,
          x: px,
          y: py,
        };
        this._debug('_measureButtonCallback', this._buttonLayout);
      }
    );
  };

  private _onRequestClose = () => {
    this._closeModalInternal();
  };

  static getDerivedStateFromProps(
    nextProps: Readonly<ReactionButtonComponentProps>,
    prevState: Readonly<ReactionButtonComponentState>
  ): any {
    if (nextProps.value >= 0) {
      return { selectedIndex: nextProps.value };
    } else if (isNumber(nextProps.defaultIndex) && nextProps.defaultIndex! >= 0) {
      return { selectedIndex: nextProps.defaultIndex };
    }

    return null;
  }

  componentDidMount() {
    if (!Array.isArray(this.props.reactions) || !this.props.reactions.length) {
      throw new Error('No reactions passed');
    }

    if (isNumber(this.props.defaultIndex) && this.props.defaultIndex! >= this.props.reactions.length) {
      throw new Error('`defaultIndex` out of range');
    }

    if (typeof this.props.reactionSize !== 'number' || this.props.reactionSize <= 0) {
      throw new Error('Invalid value passed `reactionSize`');
    }
  }

  componentDidUpdate() {
    this._measureButtonCallback();
  }

  render() {
    const reactionLayout = this._getReactionsContainerLayout();

    const backdropStyle: any = [
      styles.backdrop,
      StyleSheet.absoluteFill,
      {
        opacity: this._opacityAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.2],
          extrapolate: 'clamp',
        }),
      },
    ];

    const translatePos = this._getReactionsPosition();
    const translatePosStyle: any = [
      {
        opacity: this._opacityAnim,
        width: reactionLayout.width,
        position: 'absolute',
        left: translatePos.x,
        top: translatePos.y,
      },
      {
        transform: [
          {
            scale: this._opacityAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 1],
              extrapolate: 'clamp',
            }),
          },
        ],
      },
    ];

    let selReaction: ReactionItem | undefined;
    let ImageComponent: any;
    if (this.state.selectedIndex >= 0) {
      selReaction = this.props.reactions[this.state.selectedIndex];
      if (this.state.selectedIndex === 0 && this.props.value < 0) {
        ImageComponent = this.props.DefaultImage;
      } else {
        ImageComponent = (passedProps: any) => (
          <Image source={selReaction!.source} {...passedProps} />
        );
      }
    } else {
      selReaction = [...this.props.reactions].shift();
      ImageComponent = this.props.DefaultImage;
    }

    return (
      <>
        <TouchableOpacity
          onPress={this._onPress}
          onPressIn={this._onPressIn}
          onLongPress={this._onLongPress}
          activeOpacity={0.6}
          ref={this._reactionButtonRef}
          style={[styles.button, this.props.style]}
          hitSlop={this.props.hitSlop}
        >
          <View style={styles.wrapper}>
            {this.props.prefixComponent && (
              <Text>{this.props.prefixComponent}</Text>
            )}
            {ImageComponent && (
              <ImageComponent
                style={[
                  styles.reactionImgSmall,
                  {
                    width: this.props.reactionSmallSize,
                    height: this.props.reactionSmallSize,
                    marginHorizontal: 5, // Add some margin to space it properly
                  },
                ]}
              />
            )}
            <Text {...this.props.textProps}>{selReaction?.title}</Text>
          </View>
        </TouchableOpacity>
        <Modal visible={this.state.visible} transparent animationType="none" onRequestClose={this._onRequestClose}>
          <TouchableWithoutFeedback onPress={this._closeModal}>
            <Animated.View style={backdropStyle} />
          </TouchableWithoutFeedback>
          <Animated.View style={translatePosStyle}>
            <View
              style={[
                styles.reactions,
                this.props.reactionContainerStyle,
                {
                  flexDirection: 'row',
                  padding: PADDING_SIZE,
                },
              ]}
            >
              {this.props.reactions.map(this._renderReactionImage)}
            </View>
          </Animated.View>
        </Modal>
      </>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: PADDING_SIZE * 2,
    paddingVertical: PADDING_SIZE,
  },
  backdrop: {
    backgroundColor: '#000',
  },
  reactions: {
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  reactionImgSmall: {
    marginRight: 6,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ReactionButton;
