import React, {Component} from 'react';
import {darkFontStyles} from '../constants/font-styles';
import {StyleSheet, Text, View} from 'react-native';
import Touchable from 'react-native-platform-touchable';

export default class UploadButton extends Component {
    render() {
        const {selectedImages, setCurrSelected, uploadImages} = this.props;
        return (
            <View style={styles.centeredRow}>
                <Touchable
                    onPress={async () => {
                        uploadImages(selectedImages);
                        setCurrSelected([]);
                    }}
                >
                    <View style={styles.buttonView}>
                        <Text
                            style={[
                                darkFontStyles.regular,
                                {color: 'white', fontSize: 30}
                            ]}
                        >
                            {'UPLOAD'}
                        </Text>
                    </View>
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
        justifyContent: 'center'
    },
    buttonView: {
        width: '100%',
        paddingVertical: 40,
        paddingHorizontal: 80,
        borderColor: '#678da2',
        borderRadius: 10,
        borderWidth: 1,
        backgroundColor: '#678da2',
        justifyContent: 'center'
    },
    centeredRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 50
    }
});

