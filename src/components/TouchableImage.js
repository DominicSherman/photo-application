import React from 'react';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import {imageSize} from '../constants/variables';
import {whiteFontStyles} from '../constants/font-styles';
import {getTimeForDisplay} from '../constants/helper-functions';

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
    }
});

export default class TouchableImage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: false
        };
    }

    componentDidMount() {
        this.setState({selected: this.props.selected});
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.setState({selected: this.props.selected});
        }
    }

    handlePress = () => {
        this.setState({selected: !this.state.selected});
        this.props.actions.toggleSelected(this.props.item);
    };

    render() {
        const {item} = this.props;
        const {uri, filename, playableDuration} = item.image;

        return (
            <Touchable
                onPress={this.handlePress}
            >
                {this.state.selected ?
                    <ImageBackground
                        key={`${filename}`}
                        source={{uri}}
                        style={styles.imageStyle}
                    >
                        <View style={[styles.colorOverlay, {justifyContent: playableDuration ? 'space-between' : 'flex-end'}]}>
                            {
                                playableDuration ?
                                    <Text style={[whiteFontStyles.light, {fontSize: 12}]}>{getTimeForDisplay(playableDuration)}</Text>
                                    :
                                    null
                            }
                            <EvilIcons
                                name={'check'}
                                style={styles.icon}
                            />
                        </View>
                    </ImageBackground>
                    :
                    <ImageBackground
                        key={`${filename}`}
                        source={{uri}}
                        style={styles.imageStyle}
                    >
                        <View style={styles.overlay}>
                            {
                                playableDuration ?
                                    <Text style={[whiteFontStyles.light, {fontSize: 12}]}>{getTimeForDisplay(playableDuration)}</Text>
                                    :
                                    null
                            }
                        </View>
                    </ImageBackground>
                }
            </Touchable>
        );
    }
}