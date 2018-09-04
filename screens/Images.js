import React, {Component} from 'react';
import {CameraRoll, Dimensions, FlatList, Modal, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import {withRedux} from '../redux-factory';
import {darkFontStyles} from '../constants/font-styles';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import {renderRow} from '../helpers';

class Images extends Component {
    render() {
        return (
            <Modal
                animationType={'slide'}
                transparent={false}
                visible={this.props.modalVisible}
            >
                <SafeAreaView>
                    <View style={styles.header}>
                        <Text style={darkFontStyles.regular}>{'Select Photos to Upload'}</Text>
                        <Touchable
                            onPress={() => this.props.actions.setModalVisible(false)}
                        >
                            <EvilIcon
                                name={'close'}
                                size={30}
                            />
                        </Touchable>
                    </View>
                    <FlatList
                        data={this.props.cameraRollRows}
                        keyExtractor={(item) => item[0].node.image.uri}
                        renderItem={({item}) =>
                            renderRow(item)
                        }
                    />
                </SafeAreaView>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        alignContent: 'center'
    }
});

export default withRedux(Images);