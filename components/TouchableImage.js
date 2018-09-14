import React, {Component} from 'react';
import {ImageBackground, StyleSheet, TouchableOpacity, View} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {screenSize} from '../constants/variables';

export default class TouchableImage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: false
        }
    }

    render() {
        const {item, index, toggleSelected, currSelected} = this.props;

        return (
            <TouchableOpacity
                onPress={() => {
                    toggleSelected(item);
                    this.setState({selected: !this.state.selected})
                }}
            >
                {this.state.selected ?
                    <ImageBackground
                        key={index}
                        style={{
                            width: screenSize,
                            height: screenSize
                        }}
                        source={{uri: item.image.uri}}
                    >
                        <View style={styles.overlay}>
                            <Entypo
                                name={'check'}
                                style={styles.icon}
                            />
                        </View>
                    </ImageBackground>
                    :
                    <ImageBackground
                        key={index}
                        style={{
                            width: screenSize,
                            height: screenSize
                        }}
                        source={{uri: item.image.uri}}
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