import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import Entypo from 'react-native-vector-icons/Entypo';

export default class PlusButton extends Component {
    render() {
        const {toggleModal} = this.props;

        return (
            <View style={styles.centeredRow}>
                <Touchable
                    onPress={toggleModal}
                >
                    <Entypo
                        size={60}
                        name={'circle-with-plus'}
                    />
                </Touchable>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    centeredRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 50
    }
});