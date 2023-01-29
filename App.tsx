import React from 'react';
import {View, StyleSheet, useWindowDimensions} from 'react-native';
import Card from './src/components/TinderCard';
import users from './assets/data/users';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useAnimatedGestureHandler,
  interpolate,
} from 'react-native-reanimated';
import {GestureHandlerRootView, PanGestureHandler} from 'react-native-gesture-handler';

const ROTATION = 60;

const App = () => {
  const {width: screenWidth} = useWindowDimensions();

  const hiddenTranslateX = 2 * screenWidth;

  const translateX = useSharedValue(0);
  const rotate = useDerivedValue(
    () =>
      interpolate(translateX.value, [0, hiddenTranslateX], [0, ROTATION]) +
      'deg',
  );

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },
      {
        rotate: rotate.value,
      },
    ],
  }));

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translateX.value;
    },
    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX;
    },
    onEnd: () => {
      console.warn('Touch ended');
    },
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <View style={styles.pageContainer}>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.animatedCard, cardStyle]}>
        <Card user={users[2]} />
        </Animated.View>
      </PanGestureHandler>
    </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create(
  {
    pageContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1
    },
    animatedCard: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      rotate: '60deg',
    }
  },
);

export default App;
