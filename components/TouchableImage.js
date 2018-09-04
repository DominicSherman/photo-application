import React, {Component} from 'react';
import {Image, ImageBackground, StyleSheet, TouchableOpacity, View} from 'react-native';
import EvilIcon from 'react-native-vector-icons/EvilIcons';

export default class TouchableImage extends Component {
    state = {
        selected: false
    };

    render() {
        const {item, index, screenSize} = this.props;
        const toggleSelected = () => this.setState({selected: !this.state.selected});

        return (
            <TouchableOpacity
                onPress={() => toggleSelected()}
            >
                {this.state.selected ?
                    <ImageBackground
                        key={index}
                        style={{
                            width: screenSize,
                            height: screenSize
                        }}
                        source={{uri: item.node.image.uri}}
                    >
                        <View style={styles.overlay}>
                            <EvilIcon
                                name={'check'}
                                style={styles.icon}
                            />
                        </View>
                    </ImageBackground>
                    :
                    <Image
                        key={index}
                        style={{
                            width: screenSize,
                            height: screenSize
                        }}
                        source={{uri: item.node.image.uri}}
                    />
                }
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    icon: {
        fontSize: 40,
        color: 'green',
        opacity: 1
    },
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        flex: 1,
    }
});