import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import {Modal, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import Images from './Images';
import {darkFontStyles} from '../constants/font-styles';

export default class Home extends React.Component {
    state = {
        modalVisible: false
    };

    render() {
        if (this.state.modalVisible) {
            return (
                <Modal
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.modalVisible}
                >
                    <SafeAreaView>
                        <View style={styles.header}>
                            <Text style={darkFontStyles.regular}>{'Select Photos to Upload'}</Text>
                            <Touchable
                                onPress={() => this.setState({modalVisible: false})}
                            >
                                <EvilIcon
                                    name={'close'}
                                    size={30}
                                />
                            </Touchable>
                        </View>
                        <Images/>
                    </SafeAreaView>
                </Modal>
            );
        }

        return (
            <View style={styles.wrapper}>
                <Touchable
                    onPress={() => this.setState({modalVisible: true})}
                >
                    <Entypo
                        size={40}
                        name={'circle-with-plus'}
                    />
                </Touchable>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        alignContent: 'center'
    },
    wrapper: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
    }
});
