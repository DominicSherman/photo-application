import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import Entypo from 'react-native-vector-icons/Entypo';

const styles = StyleSheet.create({
    centeredRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 50
    }
});

export default class PlusButton extends Component {
    render() {
        const {toggleImageModal} = this.props;

        return (
            <View style={styles.centeredRow}>
                <Touchable
                    onPress={toggleImageModal}
                >
                    <Entypo
                        name={'circle-with-plus'}
                        size={60}
                    />
                </Touchable>
            </View>
        );
    }
}
