import React from 'react';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {imageSize} from '../constants/variables';
import {whiteFontStyles} from '../constants/font-styles';

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

    getTimeForDisplay = (duration) => {
        const min = Math.floor(duration / 60);
        const sec = (duration % 60) < 10 ? `0${(duration % 60)}` : (duration % 60);

        return `${min}:${sec}`;
    };

    handlePress = () => {
        this.setState({selected: !this.state.selected});
        this.props.toggleSelected(this.props.item);
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
                        style={styles.imageStyle}
                        source={{uri}}
                    >
                        <View style={[styles.colorOverlay, {justifyContent: playableDuration ? 'space-between' : 'flex-end'}]}>
                            {
                                playableDuration ?
                                    <Text style={[whiteFontStyles.light, {fontSize: 12}]}>{this.getTimeForDisplay(playableDuration)}</Text>
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
                        style={styles.imageStyle}
                        source={{uri}}
                    >
                        <View style={styles.overlay}>
                            {
                                playableDuration ?
                                    <Text style={[whiteFontStyles.light, {fontSize: 12}]}>{this.getTimeForDisplay(playableDuration)}</Text>
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

const styles = StyleSheet.create({
    icon: {
        fontSize: 40,
        color: 'blue',
        opacity: 1.0
    },
    colorOverlay: {
        backgroundColor: 'lightblue',
        opacity: 0.7,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    overlay: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    imageStyle: {
        width: imageSize,
        height: imageSize
    }
});