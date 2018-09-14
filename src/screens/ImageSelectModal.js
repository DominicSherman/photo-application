import React, {Component} from 'react';
import {darkFontStyles} from '../constants/font-styles';
import {FlatList, Modal, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import CameraRollRow from '../components/CameraRollRow';

export default class ImageSelectModal extends Component {
    render() {
        const {
            cameraRollRows,
            currSelected,
            modalVisible,
            toggleModal,
            toggleSelected,
            setSelected,
            setCurrSelected
        } = this.props;

        return (
            <Modal
                animationType={'slide'}
                transparent={false}
                visible={modalVisible}
            >
                <SafeAreaView>
                    <View style={styles.header}>
                        <Touchable
                            onPress={() => {
                                toggleModal();
                                setCurrSelected([]);
                            }}
                        >
                            <EvilIcons
                                name={'close'}
                                size={30}
                            />
                        </Touchable>
                        <Text
                            onPress={toggleModal}
                            style={[
                                darkFontStyles.regular,
                                {color: 'blue'}
                            ]}
                        >
                            {'Done'}
                        </Text>
                    </View>
                    <FlatList
                        data={cameraRollRows}
                        extraData={currSelected}
                        keyExtractor={(item) => `${item[0].timestamp}`}
                        renderItem={({item}) =>
                            <CameraRollRow
                                currSelected={currSelected}
                                images={item}
                                setSelected={setSelected}
                                toggleSelected={toggleSelected}
                            />
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