import React from 'react';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {imageSize} from '../constants/variables';

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
        const sec = duration % 60;

        return `${min}:${sec}`;
    };

    handlePress = () => {
        this.setState({selected: !this.state.selected});
        this.props.toggleSelected(this.props.item);
    };

    render() {
        const {item} = this.props;

        return (
            <Touchable
                onPress={this.handlePress}
            >
                {this.state.selected ?
                    <ImageBackground
                        key={`${item.image.filename}`}
                        style={styles.imageStyle}
                        source={{uri: item.image.uri}}
                    >
                        <View style={styles.overlay}>
                            {
                                item.image.duration ?
                                    <Text>{this.getTimeForDisplay(item.image.duration)}</Text>
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
                        key={`${item.image.filename}`}
                        style={styles.imageStyle}
                        source={{uri: item.image.uri}}
                    />
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
    overlay: {
        backgroundColor: 'lightblue',
        opacity: 0.7,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    imageStyle: {
        width: imageSize,
        height: imageSize
    }
});