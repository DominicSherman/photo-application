import React from 'react';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import {imageSize} from '../constants/variables';
import {whiteFontStyles} from '../constants/font-styles';
import {getTimeForDisplay} from '../constants/service';

const styles = StyleSheet.create({
    colorOverlay: {
        backgroundColor: 'lightblue',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        opacity: 0.7
    },
    icon: {
        color: 'blue',
        fontSize: 40,
        opacity: 1.0
    },
    imageStyle: {
        height: imageSize,
        width: imageSize
    },
    overlay: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    timeStyle: {
        fontSize: 12
    }
});

const getViewStyle = (playableDuration, selected) => {
    if (selected) {
        return [
            styles.colorOverlay,
            !playableDuration && {justifyContent: 'flex-end'}
        ];
    }

    return styles.overlay;
};

export default class TouchableImage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: false
        };
    }

    componentDidMount() {
        this.setSelected(this.props.selected);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.selected !== this.props.selected) {
            this.setSelected(this.props.selected);
        }
    }

    setSelected = (selected) => this.setState({selected});

    toggleSelected = () => this.setState((prev) => ({selected: !prev.selected}));

    handlePress = () => {
        this.toggleSelected();
        this.props.actions.toggleSelected(this.props.item);
    };

    render() {
        const {item} = this.props;
        const {uri, filename, playableDuration} = item.image;

        return (
            <Touchable
                onPress={this.handlePress}
            >
                <ImageBackground
                    key={`${filename}`}
                    source={{uri}}
                    style={styles.imageStyle}
                >
                    <View
                        style={getViewStyle(playableDuration, this.state.selected)}
                    >
                        {
                            playableDuration &&
                                <Text
                                    style={[styles.timeStyle, whiteFontStyles.light]}
                                >
                                    {getTimeForDisplay(playableDuration)}
                                </Text>
                        }
                        {
                            this.state.selected &&
                            <EvilIcons
                                name={'check'}
                                style={styles.icon}
                            />
                        }
                    </View>
                </ImageBackground>
            </Touchable>
        );
    }
}
